"use client";
import { useEffect, useState } from "react";

export default function KuuMessage() {
    const [show, setShow] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // 1. 数秒後にフェードアウトを開始
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2000); // 表示時間

        // 2. フェードアウト終了後に完全非表示
        const hideTimer = setTimeout(() => {
            setShow(false);
        }, 4000); // 表示 + フェードアウト時間（fadeOut: 1s）

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!show) return null;

    const text = "くぅーだね";

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"
                } pointer-events-none`}
        >
            <div className="flex space-x-2 text-5xl font-bold text-orange-800">
                {text.split("").map((char, i) => (
                    <span
                        key={i}
                        className="inline-block opacity-0 animate-charFadeUp"
                        style={{
                            animationDelay: `${i * 200}ms`,
                            animationFillMode: "forwards",
                        }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
}
