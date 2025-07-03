"use client";
import Link from 'next/link';
import FadeIn from "@/components/FadeIn";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, logout, user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // ログアウトAPIを呼び出し（オプション）
            // await postJson("/logout", {});
            
            // フロントエンド側でログアウト処理
            logout();
            router.push("/login");
        } catch (error) {
            console.error("ログアウト失敗:", error);
            // エラーが発生してもフロントエンド側でログアウト処理を実行
            logout();
            router.push("/login");
        }
    };

    // スクロールロック
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const menuItems = [
        { href: '/mypage', icon: 'fa-user', label: 'マイページ' },
        { href: '/document', icon: 'fa-book-open', label: 'くぅーを知る' },
        { href: '/button', icon: 'fa-hand-point-up', label: 'くぅーする' },
        { href: '/ranking', icon: 'fa-crown', label: 'ランキング' },
    ];
    const snsLinks = [
        { href: 'https://twitter.com/', icon: 'fa-twitter', label: 'Twitter' },
        { href: 'https://github.com/', icon: 'fa-github', label: 'GitHub' },
    ];

    return (
        <FadeIn delay={200}>
            <header className="bg-white shadow-sm py-4 border-b border-orange-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 flex justify-between items-center h-16">
                    {/* サイトロゴ/サイト名 */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center text-orange-700 hover:text-orange-900 transition duration-300">
                            <i className="fas fa-cookie-bite text-3xl mr-3 text-amber-500"></i>
                            <span className="font-extrabold text-3xl tracking-tight">くぅー！</span>
                        </Link>
                    </div>

                    {/* ハンバーガーメニューボタン (携帯表示時のみ) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-orange-700 hover:text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-300 rounded p-2"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* ナビゲーションメニュー (デスクトップ表示) & モバイルメニュー */}
                    <nav className={`md:flex items-center space-x-8 ${isMenuOpen ? 'block absolute top-full left-0 w-full bg-white shadow-md py-4 md:relative md:top-auto md:left-auto md:w-auto md:shadow-none' : 'hidden'}`}>
                        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-lg font-medium px-4 md:px-0">
                            <li>
                                <Link href="/mypage" className="block text-orange-700 hover:text-amber-600 transition duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                                    マイページ
                                </Link>
                            </li>
                            <li>
                                <Link href="/document" className="block text-orange-700 hover:text-amber-600 transition duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                                    くぅーを知る
                                </Link>
                            </li>
                            <li>
                                <Link href="/button" className="block text-orange-700 hover:text-amber-600 transition duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                                    くぅーする
                                </Link>
                            </li>
                            <li>
                                <Link href="/ranking" className="block text-orange-700 hover:text-amber-600 transition duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                                    ランキング
                                </Link>
                            </li>
                        </ul>

                        {/* ユーザー関連のリンク (モバイルメニュー時も表示) */}
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-6 md:mt-0 px-4 md:px-0">
                            {isLoggedIn ? (
                                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                                    {user && (
                                        <span className="text-sm text-gray-600">
                                            ようこそ、{user.name}さん
                                        </span>
                                    )}
                                <button
                                    onClick={handleLogout}
                                    className="block text-center px-6 py-2 border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition duration-300 font-semibold"
                                >
                                    ログアウト
                                </button>
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className="block text-center px-6 py-2 border border-orange-300 text-orange-700 rounded-full hover:bg-orange-50 transition duration-300 font-semibold" onClick={() => setIsMenuOpen(false)}>
                                        ログイン
                                    </Link>
                                    <Link href="/register" className="block text-center px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300 font-semibold shadow-md" onClick={() => setIsMenuOpen(false)}>
                                        新規登録
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>

                {/* モバイル用フルスクリーンメニュー */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-orange-200 via-pink-100 to-yellow-100 backdrop-blur-2xl">
                        {/* ロゴ */}
                        <div className="mb-8 flex flex-col items-center animate-fade-in">
                            <i className="fas fa-cookie-bite text-5xl text-amber-500 drop-shadow-lg"></i>
                            <span className="font-extrabold text-4xl text-orange-700 tracking-widest mt-2">くぅー！</span>
                        </div>
                        {/* メニュー本体 */}
                        <nav className="w-full max-w-xs bg-white/60 rounded-[2rem] border border-white/30 shadow-2xl p-8 flex flex-col gap-8 items-center animate-menu-scale-fade">
                            {menuItems.map((item, i) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-5 group animate-menu-item-fade-in"
                                    style={{ animationDelay: `${i * 0.09 + 0.1}s` }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-300 text-orange-500 group-hover:text-white shadow transition-all duration-300 text-2xl">
                                        <i className={`fas ${item.icon}`}></i>
                                    </span>
                                    <span className="text-2xl font-bold text-orange-700 group-hover:text-orange-900 tracking-wide transition-all duration-300">{item.label}</span>
                                </Link>
                            ))}
                            <div className="w-full border-t border-orange-200 my-4"></div>
                            {/* ユーザー名やログイン/ログアウト */}
                            {isLoggedIn ? (
                                <div className="w-full flex flex-col items-center gap-4 animate-menu-item-fade-in" style={{ animationDelay: '0.5s' }}>
                                    {user && (
                                        <div className="w-full bg-white/80 rounded-xl shadow p-3 flex flex-col items-center">
                                            <span className="text-base text-gray-600">ようこそ、{user.name}さん</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-center px-6 py-2 border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition duration-300 font-semibold"
                                    >
                                        ログアウト
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full flex flex-col items-center gap-4 animate-menu-item-fade-in" style={{ animationDelay: '0.5s' }}>
                                    <Link href="/login" className="w-full text-center px-6 py-2 border border-orange-300 text-orange-700 rounded-full hover:bg-orange-50 transition duration-300 font-semibold" onClick={() => setIsMenuOpen(false)}>
                                        ログイン
                                    </Link>
                                    <Link href="/register" className="w-full text-center px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300 font-semibold shadow-md" onClick={() => setIsMenuOpen(false)}>
                                        新規登録
                                    </Link>
                                </div>
                            )}
                            {/* SNSリンク */}
                            <div className="w-full flex justify-center gap-6 mt-6 animate-menu-item-fade-in" style={{ animationDelay: '0.7s' }}>
                                {snsLinks.map(link => (
                                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-600 text-2xl transition-colors">
                                        <i className={`fab ${link.icon}`}></i>
                                    </a>
                                ))}
                            </div>
                        </nav>
                        {/* 閉じるボタン */}
                        <button
                            className="absolute top-6 right-6 text-orange-700 hover:text-orange-900 text-4xl focus:outline-none bg-white/70 rounded-full p-2 shadow-lg border border-orange-200"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                )}
            </header>
        </FadeIn>
    );
}