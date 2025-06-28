// components/LoginPage.tsx
"use client";

// Next.jsのLinkコンポーネントは、この実行環境では解決できない可能性があるため、標準の<a>タグを使用します。
// import Link from "next/link"; 

// FadeInコンポーネントはパスの解決ができないため、ここでは使用しません。
import FadeIn from "@/components/FadeIn"; 

import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // ログインフォームの送信を処理します
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(""); // 以前のエラーメッセージをクリアします

        // 基本的なバリデーション (実際の認証ロジックに置き換えてください)
        if (!email || !password) {
            setErrorMessage("メールアドレスとパスワードを入力してください。");
            return;
        }

        // API呼び出しまたは認証をシミュレートします
        if (email === "test@example.com" && password === "password") {
            // アラートではなく、カスタムモーダルUIを使用することを推奨します。
            // alert("ログイン成功！");
            console.log("ログイン成功！"); // 開発者コンソールに成功メッセージを出力
            // ダッシュボードまたはホームページにリダイレクトします
            window.location.href = "/";
        } else {
            setErrorMessage("メールアドレスまたはパスワードが間違っています。");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-white font-inter">
            <FadeIn delay={200}>
                <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-orange-100 transform transition-all">
                    <h1 className="text-3xl font-bold text-center mb-8 text-orange-900">
                        ログイン
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@kuuu.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ease-in-out shadow-sm text-gray-800"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                パスワード
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="パスワードを入力"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ease-in-out shadow-sm text-gray-800"
                                required
                            />
                        </div>

                        {errorMessage && (
                            <p className="text-red-600 text-sm text-center">
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-400 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-rose-500 transition transform hover:scale-105"
                        >
                            ログイン
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <a href="/forgot-password" className="text-orange-600 hover:underline">
                            パスワードをお忘れですか？
                        </a>
                        <p className="mt-4 text-gray-600">
                            アカウントをお持ちでないですか？{" "}
                            <a href="/register" className="text-orange-600 font-medium hover:underline">
                                新規登録はこちら
                            </a>
                        </p>
                    </div>
                </div>
            </FadeIn>
        </main>
    );
}
