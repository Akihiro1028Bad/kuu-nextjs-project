"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import KuuGate from "@/components/KuuGate";
import { useAuth } from '@/contexts/AuthContext';

export default function MyPage() {
    const { user } = useAuth();

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
