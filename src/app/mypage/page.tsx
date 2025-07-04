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
  filePath: string;
  duration: number | null;
  createdAt: string;
}

export default function MyPage() {
    const { user } = useAuth();
    const [sounds, setSounds] = useState<KuuSound[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // 音声ファイル一覧を取得
    const fetchSounds = async () => {
        try {
            const response = await axios.get('/api/kuu/sounds');
            setSounds((response.data as any).sounds);
        } catch (error) {
            console.error('音声ファイルの取得に失敗しました:', error);
        }
    };

    useEffect(() => {
        fetchSounds();
    }, []);

    // 音声ファイルのアップロード
    const handleUpload = async () => {
        if (!fileInputRef.current?.files?.[0] || !nameInputRef.current?.value) {
            setUploadMessage('ファイルと名前を入力してください');
            return;
        }

        setIsUploading(true);
        setUploadMessage('');

        try {
            const formData = new FormData();
            formData.append('file', fileInputRef.current.files[0]);
            formData.append('name', nameInputRef.current.value);

            await axios.post('/api/kuu/sounds', formData);
            
            setUploadMessage('音声ファイルがアップロードされました！');
            fileInputRef.current.value = '';
            nameInputRef.current.value = '';
            
            // 一覧を再取得
            fetchSounds();
        } catch (error: any) {
            setUploadMessage(error.response?.data?.message || 'アップロードに失敗しました');
        } finally {
            setIsUploading(false);
        }
    };

    // 音声ファイルの削除
    const handleDelete = async (soundId: number) => {
        if (!confirm('この音声ファイルを削除しますか？')) return;

        try {
            await axios.delete(`/api/kuu/sounds/${soundId}`);
            setUploadMessage('音声ファイルが削除されました');
            fetchSounds();
        } catch (error: any) {
            setUploadMessage(error.response?.data?.message || '削除に失敗しました');
        }
    };

    // 音声ファイルの再生
    const playSound = (filePath: string) => {
        const audio = new Audio(filePath);
        audio.play().catch(error => {
            console.error('音声の再生に失敗しました:', error);
        });
    };

    // 録音成功時のコールバック
    const handleRecordingSuccess = () => {
        fetchSounds();
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
                                        ["登録日:", user?.created_at ? new Date(user.created_at).toLocaleDateString('ja-JP') : ''],
                                        ["最終更新:", user?.updated_at ? new Date(user.updated_at).toLocaleDateString('ja-JP') : ''],
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
                                
                                {/* タブ切り替え */}
                                <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
                                    <button
                                        onClick={() => setActiveTab('upload')}
                                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                                            activeTab === 'upload'
                                                ? 'bg-orange-500 text-white'
                                                : 'text-orange-700 hover:bg-orange-100'
                                        }`}
                                    >
                                        ファイルアップロード
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('record')}
                                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                                            activeTab === 'record'
                                                ? 'bg-orange-500 text-white'
                                                : 'text-orange-700 hover:bg-orange-100'
                                        }`}
                                    >
                                        録音
                                    </button>
                                </div>

                                {/* ファイルアップロードタブ */}
                                {activeTab === 'upload' && (
                                    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
                                        <h4 className="text-lg font-semibold text-orange-800 mb-4">ファイルから音声を追加</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-orange-700 mb-2">
                                                    音声の名前
                                                </label>
                                                <input
                                                    ref={nameInputRef}
                                                    type="text"
                                                    placeholder="例：癒やしのくぅー"
                                                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-orange-700 mb-2">
                                                    音声ファイル
                                                </label>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="audio/*"
                                                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                                <p className="text-xs text-orange-600 mt-1">
                                                    対応形式: MP3, WAV, OGG (最大10MB)
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleUpload}
                                                disabled={isUploading}
                                                className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isUploading ? 'アップロード中...' : '音声をアップロード'}
                                            </button>
                                            {uploadMessage && (
                                                <p className={`text-sm ${uploadMessage.includes('失敗') ? 'text-red-600' : 'text-green-600'}`}>
                                                    {uploadMessage}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 録音タブ */}
                                {activeTab === 'record' && (
                                    <div className="mb-8">
                                        <AudioRecorder onUploadSuccess={handleRecordingSuccess} />
                                    </div>
                                )}

                                {/* 音声一覧 */}
                                <div>
                                    <h4 className="text-lg font-semibold text-orange-800 mb-4">登録済み音声</h4>
                                    {sounds.length === 0 ? (
                                        <p className="text-orange-600 text-center py-8">まだ音声が登録されていません</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {sounds.map((sound) => (
                                                <div key={sound.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                                                    <div className="flex items-center space-x-4">
                                                        <button
                                                            onClick={() => playSound(sound.filePath)}
                                                            className="p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
                                                        >
                                                            ▶️
                                                        </button>
                                                        <div>
                                                            <p className="font-medium text-orange-900">{sound.name}</p>
                                                            <p className="text-sm text-orange-600">
                                                                登録日: {new Date(sound.createdAt).toLocaleDateString('ja-JP')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(sound.id)}
                                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
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
