// app/button/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
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

    // くぅーのバリエーションリスト
    const kuuVariations = [
        "くぅー", "くぅ～～！", "クゥー…", "Ku-", "くううううう",
        "くぅっ！", "くぅ？"
    ];

    // レベルアップの閾値（仮の値）
    const levelUpThreshold = 10;

    // くぅーテキストをランダムに更新する関数
    const updateKuuText = () => {
        const random = kuuVariations[Math.floor(Math.random() * kuuVariations.length)];
        setKuuText(random);
        setKuuTextFun(true);
        setTimeout(() => setKuuTextFun(false), 300);
    };

    // ランダムなサウンドを再生する関数 (オーディオファイルがないためコメントアウト)
    const playRandomSound = () => {
        // audioファイルはプロジェクト内に存在しないため、コメントアウト
        // const index = Math.floor(Math.random() * 13) + 1;
        // const audio = new Audio(`/audio/kuu${index}.mp3`);
        // audio.play();
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

    // ボタンクリック時のハンドラー
    const handleClick = async () => {
        updateKuuText();
        playRandomSound();
        try {
            const res = await axios.post("/api/kuu/count-up");
            const data = res.data as any;
            setCount(data.kuuCount);
            setLevel(data.level);
            setTitle(data.title);
            setNextLevel((data.level * 10) - data.kuuCount);
            // レベルアップ演出
            if (data.kuuCount % 10 === 0) {
                setLevelUp(true);
                setTimeout(() => setLevelUp(false), 900);
            }
        } catch (e) {
            // エラー時は何もしない
        }
    };

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
        setIsBouncing(true);
        setIsRipple(false); // 連打時リセット
        setTimeout(() => setIsRipple(true), 10); // 少し遅延して波紋を発火
        setTimeout(() => setIsBouncing(false), 350);
        setTimeout(() => setIsRipple(false), 500); // 波紋を消す
        await handleClick();
    };

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-200 via-pink-100 to-yellow-100 overflow-hidden">
            <ParticlesBG />
            <section className="relative z-10 flex flex-col items-center w-full max-w-md px-4 py-8">
                <h2 className="text-3xl font-extrabold text-orange-900 mb-6 text-center drop-shadow">さぁ、くぅーしよう！</h2>
                {/* 進捗バー */}
                <div className="w-full mb-6">
                    <div className="flex justify-between text-xs font-bold text-orange-700 mb-1">
                        <span>レベル {level}</span>
                        <span>あと {nextLevel} くぅー！</span>
                    </div>
                    <div className="w-full h-4 bg-orange-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-rose-400 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
                {/* くぅーボタン */}
                <button
                    className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-r from-orange-500 to-rose-400 text-white text-4xl font-extrabold shadow-2xl flex items-center justify-center active:scale-90 ${isBouncing ? styles['animate-bounce-kuu'] : ''}`}
                    onClick={handleClickBounce}
                    style={{ touchAction: 'manipulation', position: 'relative', zIndex: 30 }}
                >
                    {/* 波紋エフェクト */}
                    {isRipple && (
                        <span className={styles.ripple} />
                    )}
                    {kuuText}
                </button>
                {/* カウント・称号など */}
                <div className="mt-8 text-center">
                    <p className="text-xl font-bold text-orange-700">現在のくぅー数: <span className="text-orange-600">{count}</span></p>
                    <p className="text-lg text-rose-500">レベル: {level} - {title}</p>
                </div>
                {/* ランキングセクション */}
                <div className="bg-orange-50 p-4 sm:p-6 rounded-2xl shadow-inner border border-orange-200 mt-10 w-full">
                    <h3 className="text-xl sm:text-2xl font-bold text-orange-800 text-center mb-5">くぅーランキング</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-orange-200">
                            <thead className="bg-orange-100">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider rounded-tl-xl">順位</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">ユーザー</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">レベル</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">称号</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-orange-600 uppercase tracking-wider rounded-tr-xl">くぅー数</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-orange-100">
                                {rankingList.map((rank, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-orange-50" : "bg-white"}>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index === 0 ? <span className="text-2xl">🥇</span> : index === 1 ? <span className="text-2xl">🥈</span> : index === 2 ? <span className="text-2xl">🥉</span> : rank.rank}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 font-bold flex items-center gap-2">
                                            {index === 0 && <span className="text-yellow-400 text-xl">👑</span>}
                                            {rank.userName}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{rank.level}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{rank.title}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">{rank.kuuCount.toLocaleString()}</td>
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
