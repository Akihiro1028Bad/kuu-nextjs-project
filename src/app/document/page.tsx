// app/document/page.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import FadeIn from "@/components/FadeIn";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function DocumentPage() {
    const pronunciationAudioRef = useRef<HTMLAudioElement>(null);
    const playPronunciationButtonRef = useRef<HTMLButtonElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // 固定の音声ファイル（1つだけ）
    const kuuSound = '/uploads/sounds/kuu.mp3';

    const playKuuSound = () => {
        const audio = pronunciationAudioRef.current;
        if (audio) {
            audio.src = kuuSound;
            audio.play().catch(error => {
                console.error('音声再生エラー:', error);
                setIsPlaying(false);
            });
        }
    };

    useEffect(() => {
        const audio = pronunciationAudioRef.current;
        const button = playPronunciationButtonRef.current;

        if (audio && button) {
            const handlePlay = () => {
                setIsPlaying(true);
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 再生中...';
            };

            const handleEnded = () => {
                setIsPlaying(false);
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-play-circle"></i> 発音を聞く';
            };

            const handleError = () => {
                setIsPlaying(false);
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> エラー';
                console.error('音声ファイルの読み込みに失敗しました');
            };

            button.addEventListener('click', playKuuSound);
            audio.addEventListener('play', handlePlay);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('error', handleError);

            return () => {
                button.removeEventListener('click', playKuuSound);
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('error', handleError);
            };
        }
    }, []);

    return (
        <>
            <Head>
                <title>くぅー（kuuー） - ドキュメント</title>
            </Head>

            {/* Main container with a subtle background for the whole page */}
            <main className="bg-gradient-to-b from-amber-50 to-white min-h-screen py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 font-sans antialiased text-gray-800">
                <div className="max-w-4xl mx-auto container space-y-6 sm:space-y-8 lg:space-y-12">

                    {/* Section: About this document */}
                    <FadeIn delay={200}>
                        <section id="about" className="section bg-gradient-to-br from-amber-100 to-orange-100 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-amber-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-orange-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                                <span className="text-2xl sm:text-3xl lg:text-4xl mr-2 sm:mr-3 text-orange-600">📌</span> 
                                <span className="break-words">このドキュメントについて</span>
                            </h2>
                            <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 lg:mb-6 text-orange-800">
                                本ドキュメントは、日本語の感嘆詞「くぅー（kuuー）」の意味・用法・発音・文化的背景について解説します。日常会話やSNSなどで使われるこの表現を、適切に理解し活用できるようにすることを目的としています。
                            </p>
                            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-orange-700">
                                <li className="flex items-start">
                                    <i className="fas fa-check-circle text-orange-500 mr-2 mt-1 flex-shrink-0"></i> 
                                    <span className="break-words">「くぅー」の基本的な意味と使い方</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check-circle text-orange-500 mr-2 mt-1 flex-shrink-0"></i> 
                                    <span className="break-words">発音のバリエーションとニュアンスの違い</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-check-circle text-orange-500 mr-2 mt-1 flex-shrink-0"></i> 
                                    <span className="break-words">文化的な背景や使用シーン</span>
                                </li>
                            </ul>
                        </section>
                    </FadeIn>

                    <FadeIn delay={200}>
                        <section id="definition" className="section bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-orange-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                                <span className="text-2xl sm:text-3xl lg:text-4xl mr-2 sm:mr-3 text-orange-600">🎯</span> 
                                <span className="break-words">1. 定義</span>
                            </h2>
                            <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 lg:mb-6 text-orange-800">
                                「くぅー（kuuー）」は、日本語の感嘆詞の一種であり、以下のような感情を表現する際に使われる。
                            </p>
                            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-orange-700">
                                <li className="flex items-start">
                                    <i className="fas fa-hand-peace text-orange-500 mr-2 mt-1 flex-shrink-0"></i> 
                                    <span className="break-words">リラックス感・満足感</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="fas fa-exclamation-triangle text-rose-500 mr-2 mt-1 flex-shrink-0"></i> 
                                    <span className="break-words">驚き・感動</span>
                                </li>
                            </ul>
                            <p className="text-sm sm:text-base lg:text-lg leading-relaxed mt-3 sm:mt-4 lg:mt-6 text-orange-800">
                                発音時に母音を引き伸ばすことで、感情の度合いを強調することができます。
                            </p>
                        </section>
                    </FadeIn>

                    {/* Section: Grammar Information */}
                    <FadeIn delay={200}>
                        <section id="grammar" className="section bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-orange-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                                <span className="text-2xl sm:text-3xl lg:text-4xl mr-2 sm:mr-3 text-orange-600">📝</span> 
                                <span className="break-words">2. 文法情報</span>
                            </h2>
                            <div className="mb-4 sm:mb-6 lg:mb-8">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800 mb-2 sm:mb-3 flex items-center">
                                    <span className="text-xl sm:text-2xl lg:text-3xl mr-2 text-orange-600">📌</span> 
                                    <span className="break-words">2.1. 品詞分類</span>
                                </h3>
                                <p className="text-sm sm:text-base lg:text-lg text-orange-700">感動詞（interjection）</p>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800 mb-2 sm:mb-3 flex items-center">
                                    <span className="text-xl sm:text-2xl lg:text-3xl mr-2 text-orange-600">🔊</span> 
                                    <span className="break-words">2.2. 発音</span>
                                </h3>
                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg text-orange-700">
                                    <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <div className="flex items-center">
                                            <i className="fas fa-bullhorn text-orange-500 mr-2 flex-shrink-0"></i> 
                                            <span className="break-words">IPA表記：/kuː/</span>
                                        </div>
                                        <button
                                            ref={playPronunciationButtonRef}
                                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 flex items-center justify-center w-fit ${
                                                isPlaying 
                                                    ? 'bg-gradient-to-r from-orange-400 to-rose-300 cursor-not-allowed' 
                                                    : 'bg-gradient-to-r from-orange-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 hover:scale-105'
                                            }`}
                                        >
                                            <i className={`mr-2 ${isPlaying ? 'fas fa-spinner fa-spin' : 'fas fa-play-circle'}`}></i>
                                            {isPlaying ? '再生中...' : '発音を聞く'}
                                        </button>
                                    </li>
                                    <li className="flex items-start">
                                        <i className="fas fa-spell-check text-orange-500 mr-2 mt-1 flex-shrink-0"></i> 
                                        <span className="break-words">カタカナ表記：クゥー</span>
                                    </li>
                                    <li className="flex items-start">
                                        <i className="fas fa-info-circle text-gray-500 mr-2 mt-1 flex-shrink-0"></i> 
                                        <span className="break-words">音声的特徴：発音の長さで感情が変化</span>
                                    </li>
                                </ul>
                            </div>
                            <audio id="pronunciation-audio" ref={pronunciationAudioRef} preload="auto"></audio>
                        </section>
                    </FadeIn>

                    {/* Section: Meaning and Usage */}
                    <FadeIn delay={200}>
                        <section id="meaning" className="section bg-gradient-to-br from-orange-100 to-rose-50 p-0 sm:p-2 lg:p-4 rounded-2xl shadow-xl border border-orange-200 transition-all duration-300">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-900 mb-6 flex items-center justify-center tracking-tight border-b-4 border-orange-300 pb-2 bg-gradient-to-r from-orange-200/60 to-rose-100/60 rounded-t-2xl">
                                <span className="text-3xl sm:text-4xl lg:text-5xl mr-3 text-orange-600">💬</span>
                                <span className="break-words">3. 意味と用法</span>
                            </h2>
                            <div className="grid gap-6 sm:gap-8 lg:gap-10">
                                {/* 3.1 */}
                                <div className="bg-white/80 rounded-xl shadow-md p-5 sm:p-7 flex flex-col gap-4 border border-orange-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 text-2xl shadow"><i className="fas fa-wind"></i></span>
                                        <h3 className="text-xl sm:text-2xl font-bold text-orange-800 tracking-tight">3.1. リラックス感・満足感の表現</h3>
                                    </div>
                                    <p className="text-base sm:text-lg text-orange-700">使用者が快適さや満足感を得た際に自然に発せられる。</p>
                                    <div className="flex flex-col gap-3">
                                        {/* 吹き出し例文 */}
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-200 text-orange-500 text-xl shadow"><i className="fas fa-hot-tub"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「くぅー、温泉はやっぱり最高だな。」<span className="text-xs text-orange-500 ml-2">（温泉でリラックス）</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 text-xl shadow"><i className="fas fa-coffee"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「くぅー、コーヒーが体に染みる…」<span className="text-xs text-orange-500 ml-2">（美味しいコーヒーを飲んで安らぐ）</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 text-xl shadow"><i className="fas fa-beer"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「くぅー、仕事終わりのビールがたまらん！」<span className="text-xs text-orange-500 ml-2">（ビールの爽快感を楽しむ）</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* 3.2 */}
                                <div className="bg-white/80 rounded-xl shadow-md p-5 sm:p-7 flex flex-col gap-4 border border-orange-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 text-2xl shadow"><i className="fas fa-star"></i></span>
                                        <h3 className="text-xl sm:text-2xl font-bold text-orange-800 tracking-tight">3.2. 驚き・感動の表現</h3>
                                    </div>
                                    <p className="text-base sm:text-lg text-orange-700">驚きや感動を伴う場面で使用される。</p>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-200 text-orange-500 text-xl shadow"><i className="fas fa-robot"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「くぅー、これはすごい発明だ！」<span className="text-xs text-orange-500 ml-2">（驚きや感心）</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 text-xl shadow"><i className="fas fa-gamepad"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「くぅー、これはやられた！」<span className="text-xs text-orange-500 ml-2">（相手の巧妙さに驚く）</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* 3.3 */}
                                <div className="bg-white/80 rounded-xl shadow-md p-5 sm:p-7 flex flex-col gap-4 border border-orange-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-500 text-2xl shadow"><i className="fas fa-theater-masks"></i></span>
                                        <h3 className="text-xl sm:text-2xl font-bold text-orange-800 tracking-tight">3.3. 「くぅー」のみで感情を伝える（上級者向け）</h3>
                                    </div>
                                    <p className="text-base sm:text-lg text-orange-700">言葉を省略して「くぅー」だけで感情を表現することも可能。</p>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-200 text-rose-400 text-xl shadow"><i className="fas fa-wine-glass"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">（ビールを一口飲んで）「くぅー」</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-400 text-xl shadow"><i className="fas fa-cloud-sun"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">（温泉につかって）「くぅ～」</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-500 text-xl shadow"><i className="fas fa-futbol"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">（逆転ゴール）「くぅーっ！」</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* 3.4 */}
                                <div className="bg-white/80 rounded-xl shadow-md p-5 sm:p-7 flex flex-col gap-4 border border-orange-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-200 text-amber-600 text-2xl shadow"><i className="fas fa-medal"></i></span>
                                        <h3 className="text-xl sm:text-2xl font-bold text-orange-800 tracking-tight">3.4. 「くぅー」を強調する表現（プロフェッショナル向け）</h3>
                                    </div>
                                    <p className="text-base sm:text-lg text-orange-700">「くぅー」の前に言葉をつけることで、感情の強調が可能になる。</p>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-500 text-xl shadow"><i className="fas fa-trophy"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「これこそが、くぅーっ！」</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 text-xl shadow"><i className="fas fa-utensils"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「まさに…くぅーっ！」</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-200 text-orange-600 text-xl shadow"><i className="fas fa-mountain"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「これはまちがいなく…くぅーっ！」</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* 3.5 */}
                                <div className="bg-white/80 rounded-xl shadow-md p-5 sm:p-7 flex flex-col gap-4 border border-orange-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-200 text-orange-700 text-2xl shadow"><i className="fas fa-user-tie"></i></span>
                                        <h3 className="text-xl sm:text-2xl font-bold text-orange-800 tracking-tight">3.5. 「くぅー」をフォーマルにする表現（ビジネスマン向け）</h3>
                                    </div>
                                    <p className="text-base sm:text-lg text-orange-700">「です」や「ですね」を付け加えることで、フォーマルな場面でも適用しやすい表現にできる。</p>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-300 text-xl shadow"><i className="fas fa-sun"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「くぅーですよ…！」</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-400 text-xl shadow"><i className="fas fa-smile-beam"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「これはまさに、くぅーです。」</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-400 text-xl shadow"><i className="fas fa-thumbs-up"></i></span>
                                            <div className="bg-orange-50 rounded-2xl px-4 py-2 shadow-inner text-orange-900 font-medium text-base sm:text-lg relative">
                                                <span className="block">「これはくぅーですね。」</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </FadeIn>

                    {/* Section: Summary */}
                    <FadeIn delay={200}>
                        <section id="summary" className="section bg-gradient-to-br from-orange-50 to-rose-50 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-orange-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-orange-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                                <span className="text-2xl sm:text-3xl lg:text-4xl mr-2 sm:mr-3 text-rose-600">🎊</span> 
                                <span className="break-words">まとめ</span>
                            </h2>
                            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-orange-800">
                                「くぅー」は、リラックス感や驚きを伝える非常に便利な表現です。多様なニュアンスを持ち、様々な場面で活用できます。ぜひマスターして、表現豊かなコミュニケーションに役立ててください。
                            </p>
                        </section>
                    </FadeIn>
                </div>
            </main>
        </>
    );
}