// components/LoginPage.tsx
"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { useState } from "react";
import { postJsonLogin } from "@/app/lib/api";
import Modal from "@/components/Modal";
import { useAuth } from '@/contexts/AuthContext';
import styles from "@/styles/fadeIn.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const [buttonBounce, setButtonBounce] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    // ログインフォームの送信を処理します
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);
        setButtonBounce(true);
        setTimeout(() => setButtonBounce(false), 400);

        if (!email || !password) {
            setErrorMessage("メールアドレスとパスワードを入力してください。");
            setIsLoading(false);
            return;
        }

        try {
            const result = await login(email, password);
            if (result.success) {
                setShowModal(true);
            } else {
                setErrorMessage(result.message || "ログインに失敗しました。");
            }
        } catch (err: any) {
            setErrorMessage("ログインに失敗しました。");
        } finally {
            setIsLoading(false);
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
                        <div className="relative">
                            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 ${styles.iconWiggle} ${emailFocus ? styles.iconWiggleActive : ''}`}>
                                <i className="fas fa-envelope"></i>
                            </span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                placeholder="example@kuuu.com"
                                className={`w-full pl-10 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ease-in-out shadow-sm text-gray-800 ${styles.inputFocus} ${emailFocus ? styles.inputFocusActive : ''}`}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="relative mt-4">
                            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 ${styles.iconWiggle} ${passwordFocus ? styles.iconWiggleActive : ''}`}>
                                <i className="fas fa-lock"></i>
                            </span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setPasswordFocus(true)}
                                onBlur={() => setPasswordFocus(false)}
                                placeholder="パスワードを入力"
                                className={`w-full pl-10 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ease-in-out shadow-sm text-gray-800 ${styles.inputFocus} ${passwordFocus ? styles.inputFocusActive : ''}`}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {errorMessage && (
                            <p className="text-red-600 text-sm text-center">
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-400 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-rose-500 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${buttonBounce ? styles.bounce : ''}`}
                        >
                            {isLoading ? "ログイン中..." : "ログイン"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <a href="/forgot-password" className="text-orange-600 hover:underline">
                            パスワードをお忘れですか？
                        </a>
                        <p className="mt-4 text-gray-600">
                            アカウントをお持ちでないですか？{" "}
                            <Link href="/register" className="text-orange-600 font-medium hover:underline">
                                新規登録はこちら
                            </Link>
                        </p>
                    </div>
                </div>
            </FadeIn>
            <Modal
                show={showModal}
                okRedirectPath="/mypage"
                title="ログイン完了！"
                message="マイページへ移動します。"
                showKuuEffect={true}
            />
        </main>
    );
}
