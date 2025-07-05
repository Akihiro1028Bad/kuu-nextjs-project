"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import KuuGate from "@/components/KuuGate";
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AudioRecorder from '@/components/AudioRecorder';

interface KuuSound {
  id: number;
  name: string;
  duration: number | null;
  createdAt: string;
}

export default function MyPage() {
    const { user } = useAuth();
    const [sounds, setSounds] = useState<KuuSound[]>([]);

    // 音声ファイル一覧を取得（ログインユーザーのみ）
    const fetchSounds = async () => {
        // ログインしていない場合はAPIを呼ばない
        if (!user) return;
        
        try {
            const response = await axios.get('/api/kuu/sounds?userOnly=1');
            setSounds((response.data as any).sounds);
        } catch (error) {
            console.error('音声ファイルの取得に失敗しました:', error);
        }
    };

    useEffect(() => {
        fetchSounds();
    }, []);

    // 音声ファイルの削除
    const handleDelete = async (soundId: number) => {
        if (!confirm('この音声ファイルを削除しますか？')) return;

        try {
            await axios.delete(`/api/kuu/sounds/${soundId}`);
            fetchSounds();
        } catch (error: any) {
            console.error('音声ファイルの削除に失敗しました:', error);
        }
    };

    // 音声ファイルの再生
    const playSound = async (soundId: number) => {
        try {
            const response = await axios.get(`/api/kuu/sounds/${soundId}`);
            const fileData = (response.data as { fileData: string }).fileData;
            if (!fileData) return;
            const mimeType = "audio/wav";
            const byteCharacters = atob(fileData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play().catch(error => {
                console.error('音声の再生に失敗しました:', error);
            });
            audio.addEventListener('ended', () => {
                URL.revokeObjectURL(url);
            });
            audio.addEventListener('error', () => {
                URL.revokeObjectURL(url);
            });
        } catch (error) {
            console.error('音声データの取得・再生に失敗しました:', error);
        }
    };

    return (
        <KuuGate requireAuth={true}>
        <main className="min-h-screen antialiased text-gray-800 bg-gradient-to-b from-amber-50 to-white">
            <FadeIn delay={200}>
                <section className="py-16 sm:py-24 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-orange-100">
                            <h2 className="text-lg sm:text-xl md:text-3xl font-bold mb-8 text-center text-orange-900">
                                ユーザー情報
                            </h2>

                            <div className="space-y-6">
                                {[
                                        ["ユーザー名:", user?.name],
                                        ["メールアドレス:", user?.email],
                                ].map(([label, value], i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-orange-50 rounded-lg shadow-sm"
                                    >
                                        <span className="font-semibold text-orange-700 text-sm sm:text-base md:text-lg">
                                            {label}
                                        </span>
                                        <span className="text-gray-800 text-base sm:text-lg md:text-xl font-medium mt-1 sm:mt-0">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* くぅー音声管理セクション */}
                            <div className="mt-12 p-6 bg-orange-50 rounded-2xl border border-orange-200">
                                <h3 className="text-xl font-bold text-orange-900 mb-6 text-center">
                                    くぅー音声管理
                                </h3>
                                {/* 録音機能を復活 */}
                                <div className="mb-8">
                                    <AudioRecorder onUploadSuccess={fetchSounds} />
                                </div>
                                {/* 音声一覧 */}
                                <div>
                                    <h4 className="text-lg font-semibold text-orange-800 mb-4">あなたの登録音声</h4>
                                    {sounds.length === 0 ? (
                                        <p className="text-orange-600 text-center py-8">まだ音声が登録されていません</p>
                                    ) : (
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            {sounds.map((sound) => (
                                                <div key={sound.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-orange-100">
                                                    <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-0">
                                                        <button
                                                            onClick={() => playSound(sound.id)}
                                                            className="p-2 sm:p-3 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors flex-shrink-0"
                                                            style={{ minWidth: 40, minHeight: 40 }}
                                                        >
                                                            ▶️
                                                        </button>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-orange-900 truncate max-w-[140px] sm:max-w-xs md:max-w-sm">{sound.name}</p>
                                                            <p className="text-xs sm:text-sm text-orange-600 whitespace-nowrap">登録日: {new Date(sound.createdAt).toLocaleDateString('ja-JP')}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(sound.id)}
                                                        className="mt-2 sm:mt-0 px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white text-xs sm:text-sm rounded hover:bg-red-600 transition-colors flex-shrink-0"
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/button"
                                    className="transition transform hover:scale-105 hover:shadow-xl px-6 py-3 rounded-full bg-orange-500 text-white font-semibold shadow-md text-sm sm:text-base md:text-lg text-center"
                                >
                                    くぅーを連打する
                                </Link>
                                <Link
                                    href="/"
                                    className="transition transform hover:scale-105 hover:shadow-xl px-6 py-3 rounded-full bg-white text-orange-700 font-semibold shadow-md border border-orange-300 text-sm sm:text-base md:text-lg text-center"
                                >
                                    トップページに戻る
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeIn>
        </main>
        </KuuGate>
    );
}
