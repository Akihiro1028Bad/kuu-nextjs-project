// app/button/page.tsx
"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/FadeIn";
// Swalはビルド環境で解決できないため、デザイン調整時はコメントアウトします
// import Swal from "sweetalert2";

export default function KuuButtonSection() {
    // ステート変数の定義
    const [count, setCount] = useState(0); // くぅーのカウント数
    const [level, setLevel] = useState(1); // 現在のレベル
    const [title, setTitle] = useState("くぅー見習い"); // レベルに応じた称号
    const [nextLevel, setNextLevel] = useState(10); // 次のレベルアップまでのくぅー数
    const [rankingList, setRankingList] = useState([
        // ランキング表示用の仮データ
        { user: { name: "心のくぅーマスター" }, kuu_level: 100, level_title: { name: "伝説のくぅー" }, kuu_count: 100000 },
        { user: { name: "癒やしのくぅー使い" }, kuu_level: 85, level_title: { name: "至高のくぅー" }, kuu_count: 85000 },
        { user: { name: "ほっこりくぅーさん" }, kuu_level: 70, level_title: { name: "達人のくぅー" }, kuu_count: 70000 },
        { user: { name: "くぅー愛好家" }, kuu_level: 50, level_title: { name: "くぅー博士" }, kuu_count: 50000 },
        { user: { name: "ひよっこくぅー" }, kuu_level: 10, level_title: { name: "くぅー初心者" }, kuu_count: 10000 },
    ]);
    const [kuuText, setKuuText] = useState("くぅー"); // ボタンに表示されるくぅーのテキスト

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
    };

    // ランダムなサウンドを再生する関数 (オーディオファイルがないためコメントアウト)
    const playRandomSound = () => {
        // audioファイルはプロジェクト内に存在しないため、コメントアウト
        // const index = Math.floor(Math.random() * 13) + 1;
        // const audio = new Audio(`/audio/kuu${index}.mp3`);
        // audio.play();
    };

    // ボタンクリック時のハンドラー
    const handleClick = async () => {
        updateKuuText(); // くぅーテキストを更新
        playRandomSound(); // サウンドを再生

        // 以下、デザイン表示のため動作はさせないが、コードは残す
        // API: count up (カウントアップ処理)
        // const res = await fetch(`/api/kuu/count-up`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        //     },
        // });
        // const data = await res.json();
        // setCount(data.kuu_count);
        // setNextLevel(levelUpThreshold - (data.kuu_count % levelUpThreshold));

        // if (data.kuu_count % levelUpThreshold === 0) {
        //     // レベルアップ処理
        //     const levelRes = await fetch(`/api/kuu/level-up`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        //         },
        //     });
        //     const levelData = await levelRes.json();
        //     setLevel(levelData.level);
        //     setTitle(levelData.level_title);
        //     // Swal.fire (SweetAlert2) はコメントアウトされています
        //     // Swal.fire({
        //     //     title: "🎉 レベルアップ！ 🎉",
        //     //     html: `<p>新しいレベル: <strong>${levelData.level}</strong></p><p>新しい称号: <strong>${levelData.level_title}</strong></p>`,
        //     //     icon: "success",
        //     //     confirmButtonText: "閉じる"
        //     // });
        // }
        // fetchRanking(); // ランキングを再フェッチ
    };

    // ランキングをフェッチする関数 (APIがないためコメントアウト)
    const fetchRanking = async () => {
        // 以下、デザイン表示のため動作はさせないが、コードは残す
        // const res = await fetch(`/api/kuu/ranking`, {
        //     headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
        // });
        // const data = await res.json();
        // setRankingList(data.ranking_list);
    };

    // コンポーネントがマウントされた時に実行されるエフェクト
    useEffect(() => {
        // fetchRanking(); // デザイン表示のためコメントアウト
        // 初期値取得（サーバーAPIで）
        // setCount(), setLevel(), setTitle() ... を必要ならAPIから取得
    }, []);

    return (
        <FadeIn delay={200}>
        <main className="min-h-screen antialiased text-gray-800 bg-gradient-to-b from-amber-50 to-white flex items-center justify-center py-6 sm:py-10 md:py-16">
            {/* メインコンテンツエリア */}
            {/* パディングと最大幅をレスポンシブに調整 */}
            <section className="bg-white py-8 sm:py-12 md:py-16 w-full max-w-xl px-4 sm:px-6 md:px-8">
                <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl border border-orange-100 hover:shadow-2xl transform transition-all duration-300">
                    {/* タイトルと説明文のフォントサイズとマージンをレスポンシブに調整 */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-orange-900 leading-tight drop-shadow text-center mb-6 sm:mb-8 md:mb-10">
                        さぁ、くぅーしよう！
                    </h2>
                    <p className="mt-4 text-sm sm:text-base md:text-lg text-orange-800 leading-relaxed text-center mb-8 sm:mb-10 md:mb-12">
                        「くぅー」ボタンを連打して、称号をゲット！<br className="sm:hidden" />最高の称号「伝説のくぅー」目指してくぅーしまくろう！
                    </p>

                    {/* くぅーボタンエリア */}
                    <div className="flex justify-center mb-12 sm:mb-14 md:mb-16">
                        <button
                            onClick={handleClick}
                            // ボタンのサイズとテキストサイズをレスポンシブに調整
                            className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 flex items-center justify-center
                                       rounded-full bg-gradient-to-r from-orange-500 to-rose-400 text-white
                                       font-extrabold shadow-lg text-4xl sm:text-5xl md:text-6xl transform
                                       transition-all duration-200 ease-out
                                       hover:scale-103 hover:shadow-xl active:scale-98 active:shadow-md
                                       focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-75
                                       overflow-hidden group"
                        >
                            <span className="relative z-10 drop-shadow-lg">
                                {kuuText}
                            </span>
                            {/* ボタンの光沢効果 (より控えめに) */}
                            <div className="absolute inset-0 rounded-full ring-2 ring-white ring-opacity-20
                                            transition-all duration-200 group-hover:ring-3 group-hover:ring-opacity-30"></div>
                        </button>
                    </div>

                    {/* カウントとレベルの表示 */}
                    <div className="text-center mb-10 sm:mb-12 md:mb-14">
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-1 sm:mb-2">
                            現在のくぅー数: <span className="text-orange-600">{count}</span>
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mb-1 sm:mb-2">
                            レベル: <span className="text-rose-500">{level}</span> - <span className="text-rose-600">{title}</span>
                        </p>
                        <p className="text-base sm:text-lg md:text-xl text-gray-500">
                            次のレベルまで: <span className="font-bold text-orange-500">{nextLevel}</span> くぅー！
                        </p>
                    </div>

                    {/* ランキングセクション */}
                    <div className="bg-orange-50 p-4 sm:p-6 rounded-2xl shadow-inner border border-orange-200">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-800 text-center mb-5 sm:mb-6">
                            くぅーランキング
                        </h3>
                        {/* テーブルのスクロール対応 */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-orange-200">
                                <thead className="bg-orange-100">
                                    <tr>
                                        {/* テーブルヘッダーのフォントサイズとパディングを調整 */}
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider rounded-tl-xl">
                                            順位
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                                            ユーザー
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                                            レベル
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">
                                            称号
                                        </th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider rounded-tr-xl">
                                            くぅー数
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-orange-100">
                                    {rankingList.map((rank, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-orange-50" : "bg-white"}>
                                            {/* テーブルセルのフォントサイズとパディングを調整 */}
                                            <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                                                {rank.user.name}
                                            </td>
                                            <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                                                {rank.kuu_level}
                                            </td>
                                            <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                                                {rank.level_title.name}
                                            </td>
                                            <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                                                {rank.kuu_count.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        </FadeIn>
    );
}
