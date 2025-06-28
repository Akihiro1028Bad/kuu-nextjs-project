"use client"; 
import Link from 'next/link';
import FadeIn from "@/components/FadeIn";
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    <div className="md:hidden flex items-center"> {/* md:hiddenでデスクトップ時は非表示 */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)} // ★ 追加: クリックで状態を切り替える
                            className="text-orange-700 hover:text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-300 rounded p-2"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                // メニューが開いているときはXアイコン
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            ) : (
                                // メニューが閉じているときはハンバーガーアイコン
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* ナビゲーションメニュー (デスクトップ表示) & モバイルメニュー */}
                    <nav className={`md:flex items-center space-x-8 ${isMenuOpen ? 'block absolute top-full left-0 w-full bg-white shadow-md py-4 md:relative md:top-auto md:left-auto md:w-auto md:shadow-none' : 'hidden'}`}> {/* ★ 変更: md:flexを追加し、isMenuOpenで表示を切り替え */}
                        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-lg font-medium px-4 md:px-0"> {/* ★ 変更: flex-colとspace-y-4を追加 */}
                            <li>
                                <Link href="/mypage" className="block text-orange-700 hover:text-amber-600 transition duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}> {/* ★ 追加: クリックでメニューを閉じる */}
                                    マイページ
                                </Link>
                            </li>
                            <li>
                                <Link href="/document" className="block text-orange-700 hover:text-amber-600 transition duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}> {/* ★ 追加: クリックでメニューを閉じる */}
                                    くぅーを知る
                                </Link>
                            </li>
                            <li>
                                <Link href="/button" className="block text-orange-700 hover:text-amber-600 transition duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                                    くぅーする
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="block text-orange-700 hover:text-amber-600 transition duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                                    ランキング
                                </Link>
                            </li>
                        </ul>

                        {/* ユーザー関連のリンク (モバイルメニュー時も表示) */}
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-6 md:mt-0 px-4 md:px-0"> {/* ★ 変更: flex-colとspace-y-4を追加 */}
                            <Link href="/login" className="block text-center px-6 py-2 border border-orange-300 text-orange-700 rounded-full hover:bg-orange-50 transition duration-300 font-semibold" onClick={() => setIsMenuOpen(false)}>
                                ログイン
                            </Link>
                            <Link href="/register" className="block text-center px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300 font-semibold shadow-md" onClick={() => setIsMenuOpen(false)}>
                                新規登録
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>
        </FadeIn>
    );
}