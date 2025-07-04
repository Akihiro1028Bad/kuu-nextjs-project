// app/button/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import FadeIn from "@/components/FadeIn";
import styles from "@/styles/fadeIn.module.css";
import axios from "axios";
// Swalはビルド環境で解決できないため、デザイン調整時はコメントアウトします
// import Swal from "sweetalert2";

// 光の粒アニメーション用コンポーネント
function ParticlesBG() {
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, () => ({
        width: 24 + Math.random() * 32,
        height: 24 + Math.random() * 32,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: `radial-gradient(circle, #fbbf24 0%, #f472b6 100%)`,
        delay: Math.random() * 6,
      }))
    );
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-40 blur-2xl animate-pulse-slow"
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function KuuButtonSection() {
    // ステート変数の定義
    const [count, setCount] = useState(0); // くぅーのカウント数
    const [level, setLevel] = useState(1); // 現在のレベル
    const [title, setTitle] = useState("くぅー見習い"); // レベルに応じた称号
    const [nextLevel, setNextLevel] = useState(10); // 次のレベルアップまでのくぅー数
    const [rankingList, setRankingList] = useState<any[]>([]);
    const [kuuText, setKuuText] = useState("くぅー"); // ボタンに表示されるくぅーのテキスト
    const [levelUp, setLevelUp] = useState(false);
    const [kuuTextFun, setKuuTextFun] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // 処理中フラグ
    const [isPlayingAudio, setIsPlayingAudio] = useState(false); // 音声再生中フラグ
    // 再生中表示スタイル切り替え用
    const [displayStyle, setDisplayStyle] = useState(1);

    // くぅーのバリエーションリスト
    const kuuVariations = [
        "くぅー", "くぅ～～！", "クゥー…", "Ku-", "くううううう",
        "くぅっ！", "くぅ？"
    ];

    // 音声再生中のバリエーションリスト
    const playingVariations = [
        "くぅー中", "くぅー中...", "くぅー中～～", "くぅー中♪", 
        "くぅー中！", "くぅー中...", "くぅー中～", "くぅー中♡"
    ];

    // 現在の音声再生中テキスト
    const [currentPlayingText, setCurrentPlayingText] = useState("くぅー中");
    
    // 現在再生中の音声情報
    const [currentPlayingSound, setCurrentPlayingSound] = useState<{name: string, userName: string} | null>(null);

    // レベルアップの閾値（仮の値）
    const levelUpThreshold = 10;

    // くぅーテキストをランダムに更新する関数
    const updateKuuText = () => {
        const random = kuuVariations[Math.floor(Math.random() * kuuVariations.length)];
        setKuuText(random);
        setKuuTextFun(true);
        setTimeout(() => setKuuTextFun(false), 300);
    };

    // ユーザーのくぅー情報を取得
    const fetchKuuStatus = async () => {
        try {
            const res = await axios.get("/api/kuu/status");
            const data = res.data as any;
            setCount(data.kuuCount);
            setLevel(data.level);
            setTitle(data.title);
            setNextLevel((data.level * 10) - data.kuuCount);
        } catch (e) {
            // 未ログインや初回は何もしない
        }
    };

    // ボタンクリック時のハンドラー（デバウンス対応）
    const handleClick = useCallback(async () => {
        if (isProcessing || isPlayingAudio) return; // 処理中または音声再生中は重複実行を防ぐ
        setIsProcessing(true);
        updateKuuText();
        // 1. 音声一覧を取得
        try {
            // withFileData=1は付けずに取得
            const res = await axios.get("/api/kuu/sounds");
            const sounds = (res.data as any).sounds;
            if (!sounds || sounds.length === 0) {
                setIsProcessing(false);
                return;
            }
            // 2. ランダムに1件選ぶ
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            // 3. 選んだidでfileData取得
            const fileRes = await axios.get(`/api/kuu/sounds/${randomSound.id}`);
            const fileData = (fileRes.data as { fileData: string }).fileData;
            if (!fileData || typeof fileData !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(fileData)) {
                setIsProcessing(false);
                return;
            }
            // 4. 再生
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
            setIsPlayingAudio(true);
            setCurrentPlayingSound({ name: randomSound.name, userName: randomSound.user?.name || '???' });
            const randomPlayingText = playingVariations[Math.floor(Math.random() * playingVariations.length)];
            setCurrentPlayingText(randomPlayingText);
            audio.play().then(() => {
                // 再生開始
            }).catch(error => {
                setIsPlayingAudio(false);
                setCurrentPlayingSound(null);
                URL.revokeObjectURL(url);
            });
            audio.addEventListener('ended', () => {
                setIsPlayingAudio(false);
                setCurrentPlayingSound(null);
                URL.revokeObjectURL(url);
            });
            audio.addEventListener('error', () => {
                setIsPlayingAudio(false);
                setCurrentPlayingSound(null);
                URL.revokeObjectURL(url);
            });
        } catch (e) {
            setIsPlayingAudio(false);
            setCurrentPlayingSound(null);
        } finally {
            setIsProcessing(false);
        }
        // 楽観的UI更新
        const optimisticCount = count + 1;
        const optimisticLevel = Math.floor(optimisticCount / 10) + 1;
        const optimisticNextLevel = (optimisticLevel * 10) - optimisticCount;
        setCount(optimisticCount);
        setNextLevel(optimisticNextLevel);
        if (optimisticCount % 10 === 0) {
            setLevelUp(true);
            setTimeout(() => setLevelUp(false), 900);
        }
        try {
            const res = await axios.post("/api/kuu/count-up");
            const data = res.data as any;
            setCount(data.kuuCount);
            setLevel(data.level);
            setTitle(data.title);
            setNextLevel((data.level * 10) - data.kuuCount);
        } catch (e) {
            setCount(count);
            setNextLevel((level * 10) - count);
        }
    }, [count, level, isProcessing, isPlayingAudio]);

    // ランキングをフェッチする関数
    const fetchRanking = async () => {
        try {
            const res = await fetch('/api/kuu/ranking');
            const data = await res.json();
            setRankingList(data.rankings);
        } catch (e) {
            // エラー時は何もしない
        }
    };

    // コンポーネントがマウントされた時に実行されるエフェクト
    useEffect(() => {
        fetchKuuStatus();
        fetchRanking();
    }, []);

    // 進捗バーのパーセント計算
    const progressPercent = Math.max(0, Math.min(100, ((count % 10) / 10) * 100));

    // ボタンアニメーション用
    const [isBouncing, setIsBouncing] = useState(false);
    const [isRipple, setIsRipple] = useState(false);
    const handleClickBounce = async () => {
        if (isProcessing || isPlayingAudio) return; // 処理中または音声再生中は重複実行を防ぐ
        
        setIsBouncing(true);
        setIsRipple(true); // 即座に波紋を表示
        setTimeout(() => setIsBouncing(false), 150); // アニメーション時間をさらに短縮
        setTimeout(() => setIsRipple(false), 250); // 波紋を早く消す
        await handleClick();
    };

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-200 via-pink-100 to-yellow-100 overflow-hidden">
            <ParticlesBG />
            <section className="relative z-10 flex flex-col items-center w-full max-w-md px-4 py-6 sm:py-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-900 mb-4 sm:mb-6 text-center drop-shadow">さぁ、くぅーしよう！</h2>
                {/* 進捗バー */}
                <div className="w-full mb-4 sm:mb-6">
                    <div className="flex justify-between text-xs font-bold text-orange-700 mb-1">
                        <span>レベル {level}</span>
                        <span>あと {nextLevel} くぅー！</span>
                    </div>
                    <div className="w-full h-3 sm:h-4 bg-orange-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-rose-400 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
                {/* くぅーボタン */}
                <div className="relative">
                    <button
                        className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-orange-500 to-rose-400 text-white text-2xl sm:text-3xl md:text-4xl font-extrabold shadow-2xl flex items-center justify-center active:scale-90 transition-all duration-150 ${isBouncing ? styles['animate-bounce-kuu'] : ''} ${(isProcessing || isPlayingAudio) ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105'}`}
                        onClick={handleClickBounce}
                        disabled={isProcessing || isPlayingAudio}
                        style={{ touchAction: 'manipulation', position: 'relative', zIndex: 30 }}
                    >
                        {/* 波紋エフェクト */}
                        {isRipple && (
                            <span className={styles.ripple} />
                        )}
                        {(isProcessing || isPlayingAudio) ? (
                          <div className="flex items-center justify-center space-x-1 h-8">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className="inline-block w-1 bg-white rounded"
                                style={{
                                  height: '16px',
                                  animation: `equalizerBar 1s ${i * 0.1}s infinite ease-in-out alternate`
                                }}
                              />
                            ))}
                            <style jsx>{`
                              @keyframes equalizerBar {
                                0% { height: 8px; }
                                50% { height: 28px; }
                                100% { height: 8px; }
                              }
                            `}</style>
                          </div>
                        ) : kuuText}
                    </button>
                    
                    {/* 音声再生中のインジケーター */}
                    {isPlayingAudio && (
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                            </svg>
                        </div>
                    )}
                </div>
                {/* 再生中の表示パターン */}
                {isPlayingAudio && currentPlayingSound && (
                  <div className="flex flex-col items-center mb-3 sm:mb-4">
                    <span className="text-xs text-orange-500 font-semibold tracking-widest mb-1 flex items-center gap-1">
                      <span className="text-lg">👤</span>{currentPlayingSound.userName}
                    </span>
                    <span className="text-lg font-bold text-orange-700 bg-orange-50 rounded-full px-4 py-2 shadow border border-orange-200">
                      「{currentPlayingSound.name}」
                    </span>
                  </div>
                )}
                {/* カウント・称号など */}
                <div className="text-center mt-4 sm:mt-6">
                    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-pink-600 mb-3 sm:mb-4 animate-bounce">
                        {isPlayingAudio ? currentPlayingText : "くぅー"}
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-1 sm:mb-2">
                        レベル {level}
                    </div>
                    <div className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 sm:mb-4">
                        {title}
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-400 mb-4 sm:mb-6">
                        {count}
                    </div>
                </div>
                {/* ランキングセクション */}
                <div className="bg-orange-50 p-3 sm:p-4 md:p-6 rounded-2xl shadow-inner border border-orange-200 mt-6 sm:mt-8 w-full">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-800 text-center mb-3 sm:mb-5">くぅーランキング</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-orange-200">
                            <thead className="bg-orange-100">
                                <tr>
                                    <th className="px-2 sm:px-3 py-1 sm:py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider rounded-tl-xl">順位</th>
                                    <th className="px-2 sm:px-3 py-1 sm:py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">ユーザー</th>
                                    <th className="px-2 sm:px-3 py-1 sm:py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">レベル</th>
                                    <th className="px-2 sm:px-3 py-1 sm:py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">称号</th>
                                    <th className="px-2 sm:px-3 py-1 sm:py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider rounded-tr-xl">くぅー数</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-orange-100">
                                {rankingList.map((rank, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-orange-50" : "bg-white"}>
                                        <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                                            {index === 0 ? <span className="text-lg sm:text-xl md:text-2xl">🥇</span> : index === 1 ? <span className="text-lg sm:text-xl md:text-2xl">🥈</span> : index === 2 ? <span className="text-lg sm:text-xl md:text-2xl">🥉</span> : rank.rank}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 font-bold flex items-center gap-1 sm:gap-2">
                                            {index === 0 && <span className="text-yellow-400 text-sm sm:text-lg md:text-xl">👑</span>}
                                            <span className="truncate max-w-16 sm:max-w-20 md:max-w-24">{rank.userName}</span>
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700">{rank.level}</td>
                                        <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-normal break-words text-xs sm:text-sm text-gray-700">
                                            <span className="block max-w-32 sm:max-w-48 md:max-w-64">{rank.title}</span>
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700">{rank.kuuCount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
