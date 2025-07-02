// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn"; // Assuming FadeIn component exists as in HomePage
import Modal from "@/components/Modal";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Ensure Font Awesome is available if icons were used
import { postJson } from "@/app/lib/api";
import styles from "@/styles/fadeIn.module.css";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showModal, setShowModal] = useState(false); // モーダルの表示状態を管理
    const [isLoading, setIsLoading] = useState(false);
    const [buttonBounce, setButtonBounce] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);
        setButtonBounce(true);
        setTimeout(() => setButtonBounce(false), 400);

        if (password !== confirmPassword) {
            setError("パスワードが一致しません。");
            setIsLoading(false);
            return;
        }

        try {
            const result = await postJson("/register", {
                name,
                email,
                password,
            });

            setSuccessMessage("登録が完了しました！");
            setShowModal(true);
        } catch (err: any) {
            if (err.message) {
                setError(err.message);
            } else if (err.errors) {
                const messages = Object.values(err.errors).flat().join("\n");
                setError(messages);
            } else {
                setError("登録に失敗しました。");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen antialiased text-gray-800 bg-gradient-to-b from-amber-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <FadeIn delay={200}>
                <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-orange-100 transform transition-all">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-orange-900">
                            新規アカウント登録
                        </h2>
                        <p className="text-sm sm:text-base text-orange-700">
                            メールアドレスとパスワードを入力して、アカウントを作成しましょう。
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {/* 名前入力 */}
                        <div className="relative">
                            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 ${styles.iconWiggle} ${nameFocus ? styles.iconWiggleActive : ''}`}>
                                <i className="fas fa-user"></i>
                            </span>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className={`appearance-none relative block w-full pl-10 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out sm:text-sm ${styles.inputFocus} ${nameFocus ? styles.inputFocusActive : ''}`}
                                placeholder="名前"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setNameFocus(true)}
                                onBlur={() => setNameFocus(false)}
                            />
                        </div>

                        {/* メールアドレス入力 */}
                        <div className="relative mt-4">
                            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 ${styles.iconWiggle} ${emailFocus ? styles.iconWiggleActive : ''}`}>
                                <i className="fas fa-envelope"></i>
                            </span>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none relative block w-full pl-10 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out sm:text-sm ${styles.inputFocus} ${emailFocus ? styles.inputFocusActive : ''}`}
                                placeholder="メールアドレス"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                        </div>

                        {/* パスワード入力 */}
                        <div className="relative mt-4">
                            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 ${styles.iconWiggle} ${passwordFocus ? styles.iconWiggleActive : ''}`}>
                                <i className="fas fa-lock"></i>
                            </span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none relative block w-full pl-10 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out sm:text-sm ${styles.inputFocus} ${passwordFocus ? styles.inputFocusActive : ''}`}
                                placeholder="パスワード (6文字以上)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                onFocus={() => setPasswordFocus(true)}
                                onBlur={() => setPasswordFocus(false)}
                            />
                        </div>

                        {/* パスワード確認入力 */}
                        <div className="relative mt-4">
                            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 ${styles.iconWiggle} ${confirmFocus ? styles.iconWiggleActive : ''}`}>
                                <i className="fas fa-lock"></i>
                            </span>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none relative block w-full pl-10 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out sm:text-sm ${styles.inputFocus} ${confirmFocus ? styles.inputFocusActive : ''}`}
                                placeholder="パスワードをもう一度入力"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6}
                                onFocus={() => setConfirmFocus(true)}
                                onBlur={() => setConfirmFocus(false)}
                            />
                        </div>

                        {/* エラーメッセージ表示 */}
                        {error && (
                            <div className="text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* 成功メッセージ表示 */}
                        {successMessage && (
                            <div className="text-green-600 text-sm text-center">
                                {successMessage}
                            </div>
                        )}

                        {/* 登録ボタン */}
                        <div>
                            <button
                                type="submit"
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-rose-400 hover:from-orange-600 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${buttonBounce ? styles.bounce : ''}`}
                                disabled={isLoading}
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {/* ロックアイコン */}
                                    <i className="fas fa-lock text-orange-200 group-hover:text-white transition duration-150 ease-in-out"></i>
                                </span>
                                {isLoading ? "登録中..." : "新規登録"}
                            </button>
                        </div>
                    </form>

                    {/* ログインリンク */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            すでにアカウントをお持ちですか？{" "}
                            <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
                                ログインはこちら
                            </Link>
                        </p>
                    </div>
                </div>
            </FadeIn>
            <Modal
                show={showModal}
                okRedirectPath="/login"
                title="登録完了！"
                message="ログイン画面へ移動します。"
                showKuuEffect={true}
            />
        </main>
    );
}
