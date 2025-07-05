"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/fadeIn.module.css";
import { useRouter } from "next/navigation";

interface ModalProps {
    show: boolean;
    okRedirectPath?: string;
    title?: string;
    message?: string;
    onClose?: () => void;
    showKuuEffect?: boolean;
}

const KuuEffect = () => (
    <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative">
            {/* 背景の光るエフェクト */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-orange-500 to-rose-500 rounded-full p-6 shadow-2xl">
                <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg" style={{letterSpacing: '0.1em'}}>くぅー！</span>
            </div>
        </div>
        {/* 装飾的な要素 */}
        <div className="flex space-x-2 mt-4">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="w-2 h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
            ))}
        </div>
    </div>
);

const SuccessIcon = () => (
    <div className="flex justify-center mb-6">
        <div className="relative">
            {/* 背景の円 */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>
    </div>
);

const Modal: React.FC<ModalProps> = ({ show, okRedirectPath, title, message, onClose, showKuuEffect }) => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [show]);

    if (!isVisible) return null;

    const handleOk = () => {
        setIsAnimating(false);
        setTimeout(() => {
            if (okRedirectPath) {
                router.push(okRedirectPath);
            } else if (onClose) {
                onClose();
            }
        }, 200);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
            isAnimating 
                ? 'bg-black/50 backdrop-blur-sm' 
                : 'bg-black/0 backdrop-blur-none'
        }`}>
            <div className={`relative max-w-md w-full mx-4 transition-all duration-300 transform ${
                isAnimating 
                    ? 'scale-100 opacity-100' 
                    : 'scale-95 opacity-0'
            }`}>
                {/* メインコンテンツ */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
                    {/* ヘッダー部分のグラデーション */}
                    <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 p-6 text-white text-center relative overflow-hidden">
                        {/* 装飾的な背景要素 */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full"></div>
                            <div className="absolute top-8 right-4 w-4 h-4 bg-white rounded-full"></div>
                            <div className="absolute bottom-4 left-8 w-6 h-6 bg-white rounded-full"></div>
                        </div>
                        
                        {showKuuEffect ? (
                            <KuuEffect />
                        ) : (
                            <SuccessIcon />
                        )}
                        
                        {title && (
                            <h2 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
                                {title}
                            </h2>
                        )}
                    </div>

                    {/* ボディ部分 */}
                    <div className="p-6 text-center">
                        {message && (
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                {message}
                            </p>
                        )}
                        
                        {/* アクションボタン */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleOk}
                                className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300"
                            >
                                <span className="relative z-10 flex items-center space-x-2">
                                    <span>OK</span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                {/* ボタンの光るエフェクト */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 装飾的な要素 */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
        </div>
    );
};

export default Modal;
