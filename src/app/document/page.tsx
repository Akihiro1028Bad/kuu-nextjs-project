// app/document/page.tsx
"use client";

import { useEffect, useRef } from 'react';
import Head from 'next/head';
import FadeIn from "@/components/FadeIn";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function DocumentPage() {
    const pronunciationAudioRef = useRef<HTMLAudioElement>(null);
    const playPronunciationButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const audio = pronunciationAudioRef.current;
        const button = playPronunciationButtonRef.current;

        if (audio && button) {
            const handlePlay = () => {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 再生中...';
            };

            const handleEnded = () => {
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-play-circle"></i> 発音を聞く';
            };

            button.addEventListener('click', () => {
                audio.play();
            });

            audio.addEventListener('play', handlePlay);
            audio.addEventListener('ended', handleEnded);

            return () => {
                // Ensure event listeners are properly removed for cleanup
                // It's better to capture the event listener functions to remove them
                // rather than recreating an anonymous function in removeEventListener
                const clickHandler = () => audio.play();
                button.removeEventListener('click', clickHandler);
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, []);

    return (
        <>
            <Head>
                <title>くぅー（kuuー） - ドキュメント</title>
            </Head>

            {/* Main container with a subtle background for the whole page */}
            <main className="bg-gradient-to-b from-amber-50 to-white min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased text-gray-800">
                <div className="max-w-4xl mx-auto container space-y-8 sm:space-y-12 md:space-y-16">

                    {/* Section: About this document */}
                    <FadeIn delay={200}>
                        <section id="about" className="section bg-gradient-to-br from-amber-100 to-orange-100 p-6 sm:p-8 rounded-xl shadow-lg border border-amber-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-900 mb-4 sm:mb-6 flex items-center">
                                <span className="text-3xl sm:text-4xl mr-2 sm:mr-3 text-orange-600">📌</span> このドキュメントについて
                            </h2>
                            <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 text-orange-800">
                                本ドキュメントは、日本語の感嘆詞「くぅー（kuuー）」の意味・用法・発音・文化的背景について解説します。日常会話やSNSなどで使われるこの表現を、適切に理解し活用できるようにすることを目的としています。
                            </p>
                            <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-orange-700">
                                <li className="flex items-start"><i className="fas fa-check-circle text-orange-500 mr-2 mt-1"></i> <span>「くぅー」の基本的な意味と使い方</span></li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-orange-500 mr-2 mt-1"></i> <span>発音のバリエーションとニュアンスの違い</span></li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-orange-500 mr-2 mt-1"></i> <span>文化的な背景や使用シーン</span></li>
                            </ul>
                        </section>
                    </FadeIn>

                    <FadeIn delay={200}>
                        <section id="definition" className="section bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-900 mb-4 sm:mb-6 flex items-center">
                                <span className="text-3xl sm:text-4xl mr-2 sm:mr-3 text-orange-600">🎯</span> 1. 定義
                            </h2>
                            <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 text-orange-800">
                                「くぅー（kuuー）」は、日本語の感嘆詞の一種であり、以下のような感情を表現する際に使われる。
                            </p>
                            <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-orange-700">
                                <li className="flex items-start"><i className="fas fa-hand-peace text-orange-500 mr-2 mt-1"></i> <span>リラックス感・満足感</span></li>
                                <li className="flex items-start"><i className="fas fa-exclamation-triangle text-rose-500 mr-2 mt-1"></i> <span>驚き・感動</span></li>
                            </ul>
                            <p className="text-base sm:text-lg leading-relaxed mt-4 sm:mt-6 text-orange-800">
                                発音時に母音を引き伸ばすことで、感情の度合いを強調することができます。
                            </p>
                        </section>
                    </FadeIn>

                    {/* Section: Grammar Information */}
                    <FadeIn delay={200}>
                        <section id="grammar" className="section bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-900 mb-4 sm:mb-6 flex items-center">
                                <span className="text-3xl sm:text-4xl mr-2 sm:mr-3 text-orange-600">📝</span> 2. 文法情報
                            </h2>
                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-2 sm:mb-3 flex items-center">
                                    <span className="text-2xl sm:text-3xl mr-2 text-orange-600">📌</span> 2.1. 品詞分類
                                </h3>
                                <p className="text-base sm:text-lg text-orange-700">感動詞（interjection）</p>
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-2 sm:mb-3 flex items-center">
                                    <span className="text-2xl sm:text-3xl mr-2 text-orange-600">🔊</span> 2.2. 発音
                                </h3>
                                <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-orange-700">
                                    <li className="flex items-center">
                                        <i className="fas fa-bullhorn text-orange-500 mr-2"></i> IPA表記：/kuː/
                                        <button
                                            ref={playPronunciationButtonRef}
                                            className="ml-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-400 text-white text-xs sm:text-sm font-semibold shadow-md hover:from-orange-600 hover:to-rose-500 transition-colors duration-200 flex items-center justify-center"
                                            style={{ minWidth: '120px' }}
                                        >
                                            <i className="fas fa-play-circle mr-2"></i>発音を聞く
                                        </button>
                                    </li>
                                    <li className="flex items-start"><i className="fas fa-spell-check text-orange-500 mr-2 mt-1"></i> <span>カタカナ表記：クゥー</span></li>
                                    <li className="flex items-start"><i className="fas fa-info-circle text-gray-500 mr-2 mt-1"></i> <span>音声的特徴：発音の長さで感情が変化</span></li>
                                </ul>
                            </div>
                            <audio id="pronunciation-audio" ref={pronunciationAudioRef} src="/audio/kuu7.mp3" preload="auto"></audio>
                        </section>
                    </FadeIn>

                    {/* Section: Meaning and Usage */}
                    <FadeIn delay={200}>
                        <section id="meaning" className="section bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-900 mb-4 sm:mb-6 flex items-center">
                                <span className="text-3xl sm:text-4xl mr-2 sm:mr-3 text-orange-600">💬</span> 3. 意味と用法
                            </h2>

                            {/* Subsection: Relaxation/Satisfaction */}
                            <div className="subsection mb-8 sm:mb-10 pb-3 sm:pb-4 border-b border-orange-100 last:border-b-0">
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 sm:mb-4 flex items-center">
                                    <i className="fas fa-wind text-orange-600 text-2xl sm:text-3xl mr-2 sm:mr-3"></i> 3.1. リラックス感・満足感の表現
                                </h3>
                                <p className="text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 text-orange-700">
                                    使用者が快適さや満足感を得た際に自然に発せられる。
                                </p>
                                <p className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 text-rose-600">✅ 例文</p>
                                <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-orange-700">
                                    <li className="flex items-start"><i className="fas fa-hot-tub text-orange-400 mr-2 mt-1"></i> <span>「くぅー、温泉はやっぱり最高だな。」（温泉でリラックス）</span></li>
                                    <li className="flex items-start"><i className="fas fa-coffee text-amber-600 mr-2 mt-1"></i> <span>「くぅー、コーヒーが体に染みる…」（美味しいコーヒーを飲んで安らぐ）</span></li>
                                    <li className="flex items-start"><i className="fas fa-beer text-yellow-600 mr-2 mt-1"></i> <span>「くぅー、仕事終わりのビールがたまらん！」（ビールの爽快感を楽しむ）</span></li>
                                </ul>
                            </div>

                            {/* Subsection: Surprise/Impression */}
                            <div className="subsection mb-8 sm:mb-10 pb-3 sm:pb-4 border-b border-orange-100 last:border-b-0">
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 sm:mb-4 flex items-center">
                                    <i className="fas fa-star text-amber-500 text-2xl sm:text-3xl mr-2 sm:mr-3"></i> 3.2. 驚き・感動の表現
                                </h3>
                                <p className="text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 text-orange-700">
                                    驚きや感動を伴う場面で使用される。
                                </p>
                                <p className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 text-rose-600">✅ 例文</p>
                                <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-orange-700">
                                    <li className="flex items-start"><i className="fas fa-robot text-orange-500 mr-2 mt-1"></i> <span>「くぅー、これはすごい発明だ！」（驚きや感心）</span></li>
                                    <li className="flex items-start"><i className="fas fa-gamepad text-purple-500 mr-2 mt-1"></i> <span>「くぅー、これはやられた！」（相手の巧妙さに驚く）</span></li>
                                </ul>
                            </div>

                            {/* Subsection: Expressing Emotion Solely with "kuuー" */}
                            <div className="subsection mb-8 sm:mb-10 pb-3 sm:pb-4 border-b border-orange-100 last:border-b-0">
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 sm:mb-4 flex items-center">
                                    <i className="fas fa-theater-masks text-rose-500 text-2xl sm:text-3xl mr-2 sm:mr-3"></i> 3.3. 「くぅー」のみで感情を伝える（上級者向け）
                                </h3>
                                <p className="text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 text-orange-700">
                                    言葉を省略して「くぅー」だけで感情を表現することも可能。
                                </p>
                                <p className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 text-rose-600">✅ 例文</p>
                                <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-orange-700">
                                    <li className="flex items-start"><i className="fas fa-wine-glass text-rose-400 mr-2 mt-1"></i> <span>（ビールを一口飲んで）「くぅー」</span></li>
                                    <li className="flex items-start"><i className="fas fa-cloud-sun text-yellow-400 mr-2 mt-1"></i> <span>（温泉につかって）「くぅ～」</span></li>
                                    <li className="flex items-start"><i className="fas fa-futbol text-green-500 mr-2 mt-1"></i> <span>（逆転ゴール）「くぅーっ！」</span></li>
                                </ul>
                            </div>

                            {/* Subsection: Emphasizing "kuuー" */}
                            <div className="subsection mb-8 sm:mb-10 pb-3 sm:pb-4 border-b border-orange-100 last:border-b-0">
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 sm:mb-4 flex items-center">
                                    <i className="fas fa-medal text-amber-600 text-2xl sm:text-3xl mr-2 sm:mr-3"></i> 3.4. 「くぅー」を強調する表現（プロフェッショナル向け）
                                </h3>
                                <p className="text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 text-orange-700">
                                    「くぅー」の前に言葉をつけることで、感情の強調が可能になる。
                                </p>
                                <p className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 text-rose-600">✅ 例文</p>
                                <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-orange-700">
                                    <li className="flex items-start"><i className="fas fa-trophy text-amber-500 mr-2 mt-1"></i> <span>「これこそが、くぅーっ！」</span></li>
                                    <li className="flex items-start"><i className="fas fa-utensils text-gray-600 mr-2 mt-1"></i> <span>「まさに…くぅーっ！」</span></li>
                                    <li className="flex items-start"><i className="fas fa-mountain text-orange-600 mr-2 mt-1"></i> <span>「これはまちがいなく…くぅーっ！」</span></li>
                                </ul>
                            </div>

                            {/* Subsection: Formalizing "kuuー" */}
                            <div className="subsection mb-8 sm:mb-10 pb-3 sm:pb-4 border-b border-orange-100 last:border-b-0">
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-3 sm:mb-4 flex items-center">
                                    <i className="fas fa-user-tie text-orange-700 text-2xl sm:text-3xl mr-2 sm:mr-3"></i> 3.5. 「くぅー」をフォーマルにする表現（ビジネスマン向け）
                                </h3>
                                <p className="text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 text-orange-700">
                                    「です」や「ですね」を付け加えることで、フォーマルな場面でも適用しやすい表現にできる。
                                </p>
                                <p className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 text-rose-600">✅ 例文</p>
                                <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg text-orange-700">
                                    <li className="flex items-start"><i className="fas fa-sun text-yellow-300 mr-2 mt-1"></i> <span>「くぅーですよ…！」</span></li>
                                    <li className="flex items-start"><i className="fas fa-smile-beam text-pink-400 mr-2 mt-1"></i> <span>「これはまさに、くぅーです。」</span></li>
                                    <li className="flex items-start"><i className="fas fa-thumbs-up text-orange-400 mr-2 mt-1"></i> <span>「これはくぅーですね。」</span></li>
                                </ul>
                            </div>
                        </section>
                    </FadeIn>

                    {/* Section: Summary */}
                    <FadeIn delay={200}>
                        <section id="summary" className="section bg-gradient-to-br from-orange-50 to-rose-50 p-6 sm:p-8 rounded-xl shadow-lg border border-orange-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-900 mb-4 sm:mb-6 flex items-center">
                                <span className="text-3xl sm:text-4xl mr-2 sm:mr-3 text-rose-600">🎊</span> まとめ
                            </h2>
                            <p className="text-base sm:text-lg leading-relaxed text-orange-800">
                                「くぅー」は、リラックス感や驚きを伝える非常に便利な表現です。多様なニュアンスを持ち、様々な場面で活用できます。ぜひマスターして、表現豊かなコミュニケーションに役立ててください。
                            </p>
                        </section>
                    </FadeIn>

                    {/* Multiple audio files (hidden) */}
                    <audio id="kuuSound" preload="auto" style={{ display: 'none' }}>
                        <source src="/audio/kuu1.mp3" type="audio/mp3" />
                        <source src="/audio/kuu2.mp3" type="audio/mp3" />
                        <source src="/audio/kuu3.mp3" type="audio/mp3" />
                        <source src="/audio/kuu4.mp3" type="audio/mp3" />
                        <source src="/audio/kuu5.mp3" type="audio/mp3" />
                        <source src="/audio/kuu6.mp3" type="audio/mp3" />
                        <source src="/audio/kuu7.mp3" type="audio/mp3" />
                        <source src="/audio/kuu8.mp3" type="audio/mp3" />
                        <source src="/audio/kuu9.mp3" type="audio/mp3" />
                        <source src="/audio/kuu10.mp3" type="audio/mp3" />
                        <source src="/audio/kuu11.mp3" type="audio/mp3" />
                        <source src="/audio/kuu12.mp3" type="audio/mp3" />
                        <source src="/audio/kuu13.mp3" type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </main>
        </>
    );
}