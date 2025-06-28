// app/page.tsx
"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function HomePage() {
    const features = [
        {
            icon: "",
            title: "深く、じっくり知る",
            desc: "「くぅー」の言葉が持つ意味や背景を、温かい言葉でじっくり解説。きっと新しい発見がありますよ。",
            link: "/document",
        },
        {
            icon: "",
            title: "癒やしの「くぅー」連打",
            desc: "心地よい響きと共にボタンを連打！心と体を癒やしながら、「くぅー」レベルをどんどん上げましょう！",
            link: "/button",
        },
        {
            icon: "",
            title: "みんなで「くぅー」を育む",
            desc: "全国の「くぅー」好きの仲間たちと、その喜びを分かち合いませんか？ランキングで絆を深めましょう。",
            link: "#",
        },
    ];

    const ranking = [
        ["心のくぅーマスター", 10000, ""],
        ["癒やしのくぅー使い", 8500, ""],
        ["ほっこりくぅーさん", 7000, ""],
    ];

    return (
        <main className="min-h-screen antialiased text-gray-800 bg-gradient-to-b from-amber-50 to-white">
            {/* Hero */}
            <FadeIn delay={200}>
                <section className="relative py-28 text-center bg-gradient-to-br from-amber-100 via-orange-200 to-rose-200 shadow-inner overflow-hidden">
                    <div className="text-6xl sm:text-7xl text-amber-600 mb-8 flex justify-center space-x-8">
                        {/* Removed emojis */}
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide text-orange-900 leading-tight drop-shadow">
                        くぅーでつながる、やさしい世界。
                    </h1>
                    <p className="mt-6 text-base sm:text-lg md:text-xl text-orange-800 leading-relaxed animate-fade-in">
                        くぅーって言いたくなる瞬間、あるよね。<br />
                        その気持ち、大事にしよう。
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6 animate-fade-in">
                        <Link href="/document" className="transition transform hover:scale-105 hover:shadow-xl px-8 py-4 rounded-full bg-white text-orange-700 font-semibold shadow-md">
                            「くぅー」を知る
                        </Link>
                        <Link href="/button" className="transition transform hover:scale-105 hover:shadow-xl px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-rose-400 text-white font-semibold shadow-md">
                            さっそく体験する
                        </Link>
                    </div>
                </section>
            </FadeIn>

            {/* Features */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-16 text-orange-900">
                        「くぅー」のあったかい楽しみ方
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <FadeIn key={i} delay={i * 200}>
                                <div className="group bg-white p-8 rounded-3xl shadow-xl border border-orange-100 hover:shadow-2xl transform transition-all hover:-translate-y-2">
                                    <div className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition">{f.icon}</div>
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-orange-800">{f.title}</h3>
                                    <p className="text-sm sm:text-base md:text-lg text-orange-700 mb-4">{f.desc}</p>
                                    <Link href={f.link} className="text-orange-600 font-medium hover:underline">→ 詳しく見る</Link>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ranking */}
            <section className="py-24 bg-orange-50">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-16 text-orange-900">
                        みんなの「くぅー」温もりランキング
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {ranking.map(([name, count], i) => (
                            <FadeIn key={i} delay={i * 200}>
                                <div className="bg-white p-8 rounded-2xl shadow-md border border-orange-200 hover:shadow-xl transition hover:scale-[1.03] text-center">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-rose-500 mb-2">#{i + 1}</div>
                                    <div className="text-base sm:text-lg font-bold text-gray-800 mb-1">{name}</div>
                                    <div className="text-lg sm:text-xl text-orange-500">{count.toLocaleString()}回</div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <FadeIn delay={200}>
                <section className="py-20 bg-gradient-to-br from-pink-500 via-red-500 to-rose-500 text-white text-center">
                    <div className="max-w-3xl mx-auto px-6">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">「くぅー」で、心を温めませんか？</h3>
                        <p className="text-base sm:text-lg md:text-xl text-pink-100 mb-10 leading-relaxed">
                            アカウント登録して、あなただけの「くぅー」体験を今すぐ始めましょう！
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link href="/register" className="bg-white text-rose-600 font-semibold px-8 py-4 rounded-full shadow-md hover:bg-rose-50 transition hover:scale-105">
                                新規登録はこちら
                            </Link>
                            <Link href="/login" className="bg-rose-700 text-white font-semibold px-8 py-4 rounded-full shadow-md hover:bg-rose-800 transition hover:scale-105">
                                ログインはこちら
                            </Link>
                        </div>
                    </div>
                </section>
            </FadeIn>
        </main>
    );
}
