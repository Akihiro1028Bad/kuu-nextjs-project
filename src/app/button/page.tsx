// app/button/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import FadeIn from "@/components/FadeIn";
import styles from "@/styles/fadeIn.module.css";
import axios from "axios";
// Swalはビルド環境で解決できないため、デザイン調整時はコメントアウトします
// import Swal from "sweetalert2";

// 光の粒アニメーション用コンポーネント（メモ化）
const ParticlesBG = () => {
  const [particles, setParticles] = useState<any[]>([]);
  
  useEffect(() => {
    // クライアントサイドでのみランダム値を生成
    setParticles(
      Array.from({ length: 12 }, () => ({
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
};

export default function KuuButtonSection() {
    // ステート変数の定義
    const [count, setCount] = useState(0);
    const [level, setLevel] = useState(1);
    const [title, setTitle] = useState("くぅー見習い");
    const [nextLevel, setNextLevel] = useState(10);
    const [rankingList, setRankingList] = useState<any[]>([]);
    const [kuuText, setKuuText] = useState("くぅー");
    const [levelUp, setLevelUp] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [sounds, setSounds] = useState<any[]>([]);
    const [soundDataMap, setSoundDataMap] = useState<Map<number, string>>(new Map());
    const [isPrefetching, setIsPrefetching] = useState(false);
    const [prefetchProgress, setPrefetchProgress] = useState(0);
    const [currentPlayingSound, setCurrentPlayingSound] = useState<{name: string, userName: string} | null>(null);
    const [isBouncing, setIsBouncing] = useState(false);
    const [isRipple, setIsRipple] = useState(false);
    const [lastPlayedSoundId, setLastPlayedSoundId] = useState<number | null>(null);

    // 音声オブジェクトのキャッシュ
    const audioCache = useRef<Map<number, HTMLAudioElement>>(new Map());
    
    // 音声選択履歴（より多様な選択のため）
    const soundHistory = useRef<number[]>([]);

    // くぅーのバリエーションリスト（メモ化）
    const kuuVariations = useMemo(() => [
        "くぅー", "くぅ～～！", "クゥー…", "Ku-", "くううううう",
        "くぅっ！", "くぅ？"
    ], []);

    // 音声再生中のバリエーションリスト（メモ化）
    const playingVariations = useMemo(() => [
        "くぅー中", "くぅー中...", "くぅー中～～", "くぅー中♪", 
        "くぅー中！", "くぅー中...", "くぅー中～", "くぅー中♡"
    ], []);

    // くぅーテキストをランダムに更新する関数（メモ化）
    const updateKuuText = useCallback(() => {
        const random = kuuVariations[Math.floor(Math.random() * kuuVariations.length)];
        setKuuText(random);
    }, [kuuVariations]);

    // ユーザーのくぅー情報を取得
    const fetchKuuStatus = useCallback(async () => {
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
    }, []);

    // 音声データをBlobに変換する関数（メモ化）
    const createAudioBlob = useCallback((fileData: string) => {
        const byteCharacters = atob(fileData);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Blob([byteNumbers], { type: "audio/wav" });
    }, []);

    // 音声を再生する関数（最適化）
    const playAudio = useCallback(async (soundId: number, soundInfo: any) => {
        try {
            // キャッシュから音声オブジェクトを取得
            let audio = audioCache.current.get(soundId);
            
            if (!audio) {
                // キャッシュにない場合は新規作成
                let fileData = soundDataMap.get(soundId);
                if (!fileData) {
                    const fileRes = await axios.get(`/api/kuu/sounds/${soundId}`);
                    fileData = (fileRes.data as { fileData: string }).fileData;
                }
                
                if (!fileData || typeof fileData !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(fileData)) {
                    return false;
                }
                
                const blob = createAudioBlob(fileData);
                const url = URL.createObjectURL(blob);
                audio = new Audio(url);
                
                // イベントリスナーを設定
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
                
                // キャッシュに保存
                audioCache.current.set(soundId, audio);
            }
            
            // 音声情報を設定
            setCurrentPlayingSound({ 
                name: soundInfo.name, 
                userName: soundInfo.user?.name || '???' 
            });
            
            // 再生
            await audio.play();
            return true;
        } catch (error) {
            setIsPlayingAudio(false);
            setCurrentPlayingSound(null);
            return false;
        }
    }, [soundDataMap, createAudioBlob]);

    // 音声一覧＋段階的プリフェッチ
    useEffect(() => {
        const fetchAndPrefetch = async () => {
            setIsPrefetching(true);
            try {
                // 1. 全音声一覧を取得（fileDataなし）
                const allSoundsRes = await axios.get("/api/kuu/sounds");
                const allSounds = (allSoundsRes.data as any).sounds;
                
                if (allSounds.length === 0) {
                    setIsPrefetching(false);
                    return;
                }
                
                // 全音声をシャッフルして、最初の数件を即座に取得
                const shuffledAllSounds = allSounds.sort(() => Math.random() - 0.5);
                const initialCount = Math.min(5, allSounds.length); // 最大5件まで初期取得
                const selectedInitialSounds = shuffledAllSounds.slice(0, initialCount);
                
                // 選択した2件のfileDataを取得
                const initialRes = await Promise.all(
                    selectedInitialSounds.map(async (sound: any) => {
                        try {
                            const fileRes = await axios.get(`/api/kuu/sounds/${sound.id}`);
                            return {
                                ...sound,
                                fileData: (fileRes.data as { fileData: string }).fileData
                            };
                        } catch {
                            return null;
                        }
                    })
                );
                
                const initialSounds = initialRes.filter(sound => sound !== null);
                
                if (initialSounds.length === 0) {
                    setIsPrefetching(false);
                    return;
                }
                
                // 初期2件を即座に再生可能にする
                const initialData = initialSounds.map((sound: any) => [
                    sound.id, 
                    sound.fileData
                ] as [number, string]);
                
                setSoundDataMap(new Map(initialData));
                setSounds(initialSounds);
                setIsPrefetching(false);
                
                // 2. 残りの音声を段階的に取得
                if (allSounds.length > initialCount) {
                    // 初期取得分以外の音声を段階的に取得
                    const remainingSounds = allSounds.filter((sound: any) => 
                        !initialSounds.some((initial: any) => initial.id === sound.id)
                    );
                    progressivePrefetch(remainingSounds);
                }
            } catch (error) {
                setIsPrefetching(false);
            }
        };
        fetchAndPrefetch();
    }, []);

    // 段階的に音声をプリフェッチする関数
    const progressivePrefetch = useCallback(async (remainingSounds: any[]) => {
        try {
            const batchSize = 3; // 3件ずつ取得（より頻繁に追加）
            const interval = 1500; // 1.5秒間隔（より早く追加）
            let currentSounds = [...sounds]; // 現在のsoundsをコピー
            
            for (let i = 0; i < remainingSounds.length; i += batchSize) {
                const batch = remainingSounds.slice(i, i + batchSize);
                
                // バッチ内でランダムに選択（バッチサイズが3未満の場合は全て選択）
                const shuffledBatch = batch.sort(() => Math.random() - 0.5).slice(0, Math.min(3, batch.length));
                
                // バッチの音声データを取得
                const batchData = await Promise.all(
                    shuffledBatch.map(async (sound: any) => {
                        try {
                            const fileRes = await axios.get(`/api/kuu/sounds/${sound.id}`);
                            return [sound.id, (fileRes.data as { fileData: string }).fileData] as [number, string];
                        } catch {
                            return [sound.id, null] as [number, string|null];
                        }
                    })
                );
                
                // 有効なデータのみをキャッシュに追加
                const validBatchData = batchData.filter(([id, data]) => data !== null) as [number, string][];
                setSoundDataMap(prev => new Map([...prev, ...validBatchData]));
                
                // soundsリストに追加
                const newSounds = [...currentSounds, ...shuffledBatch];
                setSounds(newSounds);
                currentSounds = newSounds;
                
                // 進捗を更新
                const progress = Math.min(100, Math.round(((i + batchSize) / remainingSounds.length) * 100));
                setPrefetchProgress(progress);
                
                // 最後のバッチでない場合は待機
                if (i + batchSize < remainingSounds.length) {
                    await new Promise(resolve => setTimeout(resolve, interval));
                }
            }
            
            setPrefetchProgress(100);
        } catch (error) {
            // バックグラウンド処理なのでエラーは無視
        }
    }, [sounds]);

    // ボタンクリック時のハンドラー（最適化）
    const handleClick = useCallback(async () => {
        if (isProcessing || isPlayingAudio || isPrefetching) return;
        
        setIsProcessing(true);
        updateKuuText();
        
        try {
            if (!sounds || sounds.length === 0) {
                setIsProcessing(false);
                return;
            }
            
            // 汎用的な異なる音声選択
            let selectedSound;
            
            if (sounds.length === 1) {
                // 音声が1件のみの場合はそれを使用
                selectedSound = sounds[0];
            } else {
                // 2件以上の場合は前回と異なるものを選択
                const lastSound = soundHistory.current[soundHistory.current.length - 1];
                
                if (lastSound && sounds.length > 1) {
                    // 前回の音声を除外して選択
                    const availableSounds = sounds.filter(sound => sound.id !== lastSound);
                    selectedSound = availableSounds[Math.floor(Math.random() * availableSounds.length)];
                } else {
                    // 履歴がない場合や音声が1件の場合はランダム選択
                    selectedSound = sounds[Math.floor(Math.random() * sounds.length)];
                }
            }
            
            // 楽観的UI更新（先に実行）
            const optimisticCount = count + 1;
            const optimisticLevel = Math.floor(optimisticCount / 10) + 1;
            const optimisticNextLevel = (optimisticLevel * 10) - optimisticCount;
            setCount(optimisticCount);
            setNextLevel(optimisticNextLevel);
            
            if (optimisticCount % 10 === 0) {
                setLevelUp(true);
                setTimeout(() => setLevelUp(false), 900);
            }
            
            // 音声再生（非同期）
            setIsPlayingAudio(true);
            setLastPlayedSoundId(selectedSound.id);
            
            // 履歴に追加
            soundHistory.current.push(selectedSound.id);
            if (soundHistory.current.length > 10) {
                soundHistory.current.shift(); // 古い履歴を削除
            }
            
            playAudio(selectedSound.id, selectedSound);
            
            // API呼び出し（非同期）
            try {
                const res = await axios.post("/api/kuu/count-up");
                const data = res.data as any;
                setCount(data.kuuCount);
                setLevel(data.level);
                setTitle(data.title);
                setNextLevel((data.level * 10) - data.kuuCount);
            } catch (e) {
                // エラー時は楽観的更新を維持
            }
        } catch (e) {
            setIsPlayingAudio(false);
            setCurrentPlayingSound(null);
        } finally {
            setIsProcessing(false);
        }
    }, [count, level, isProcessing, isPlayingAudio, isPrefetching, sounds, playAudio, updateKuuText]);

    // ランキングをフェッチする関数
    const fetchRanking = useCallback(async () => {
        try {
            const res = await fetch('/api/kuu/ranking');
            const data = await res.json();
            setRankingList(data.rankings);
        } catch (e) {
            // エラー時は何もしない
        }
    }, []);

    // コンポーネントがマウントされた時に実行されるエフェクト
    useEffect(() => {
        fetchKuuStatus();
        fetchRanking();
    }, [fetchKuuStatus, fetchRanking]);

    // 進捗バーのパーセント計算（メモ化）
    const progressPercent = useMemo(() => 
        Math.max(0, Math.min(100, ((count % 10) / 10) * 100)), [count]
    );

    // ボタンアニメーション用
    const handleClickBounce = useCallback(async () => {
        if (isProcessing || isPlayingAudio) return;
        
        setIsBouncing(true);
        setIsRipple(true);
        setTimeout(() => setIsBouncing(false), 150);
        setTimeout(() => setIsRipple(false), 250);
        await handleClick();
    }, [isProcessing, isPlayingAudio, handleClick]);

    // 現在の音声再生中テキスト（メモ化）
    const currentPlayingText = useMemo(() => {
        if (!isPlayingAudio) return "くぅー";
        return playingVariations[Math.floor(Math.random() * playingVariations.length)];
    }, [isPlayingAudio, playingVariations]);

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-200 via-pink-100 to-yellow-100 overflow-hidden">
            <ParticlesBG />
            {/* プリフェッチ中のインジケーター */}
            {isPrefetching && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-orange-100 border border-orange-300 rounded-full px-4 py-2 shadow-lg flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-orange-700">初期音声を準備中...</span>
                </div>
            )}
            
            {/* 段階的プリフェッチ進捗 */}
            {!isPrefetching && prefetchProgress > 0 && prefetchProgress < 100 && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-300 rounded-full px-4 py-2 shadow-lg flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-green-700">音声を追加中... {prefetchProgress}%</span>
                </div>
            )}
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
                        className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-orange-500 to-rose-400 text-white text-2xl sm:text-3xl md:text-4xl font-extrabold shadow-2xl flex items-center justify-center active:scale-90 transition-all duration-150 ${isBouncing ? styles['animate-bounce-kuu'] : ''} ${(isProcessing || isPlayingAudio || isPrefetching) ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105'}`}
                        onClick={handleClickBounce}
                        disabled={isProcessing || isPlayingAudio || isPrefetching}
                        style={{ touchAction: 'manipulation', position: 'relative', zIndex: 30 }}
                    >
                        {/* 波紋エフェクト */}
                        {isRipple && (
                            <span className={styles.ripple} />
                        )}
                        {isPrefetching ? (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-xs font-medium">音声読み込み中...</div>
                          </div>
                        ) : (isProcessing || isPlayingAudio) ? (
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
                        ) : sounds.length === 0 ? (
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <div className="text-lg">🎵</div>
                            <div className="text-xs font-medium text-center">音声がありません</div>
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
                        {currentPlayingText}
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

                {/* 音声がない場合のメッセージ */}
                {!isPrefetching && sounds.length === 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                        <div className="text-2xl mb-2">🎵</div>
                        <div className="text-sm text-yellow-700 font-medium mb-2">音声が登録されていません</div>
                        <div className="text-xs text-yellow-600">
                            誰かが音声を登録するまでお待ちください
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
