"use client";

import React from "react";
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
    <div className="flex flex-col items-center justify-center mb-4 animate-bounce">
        <span className="text-5xl md:text-6xl font-extrabold text-orange-500 drop-shadow-lg" style={{letterSpacing: '0.1em'}}>くぅー！</span>
        <img src="/window.svg" alt="くぅー！" className="w-24 h-24 mt-2" />
    </div>
);

const Modal: React.FC<ModalProps> = ({ show, okRedirectPath, title, message, onClose, showKuuEffect }) => {
    const router = useRouter();

    if (!show) return null;

    const handleOk = () => {
        if (okRedirectPath) {
            router.push(okRedirectPath);
        } else if (onClose) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-fadeIn">
                {showKuuEffect && <KuuEffect />}
                {title && <h2 className="text-2xl font-bold mb-2 text-orange-700">{title}</h2>}
                {message && <p className="mb-6 text-gray-700">{message}</p>}
                <button
                    onClick={handleOk}
                    className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 text-white font-semibold shadow hover:from-orange-500 hover:to-rose-500 transition transform hover:scale-105"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default Modal;
