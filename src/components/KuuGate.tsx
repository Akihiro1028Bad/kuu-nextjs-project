// components/KuuGate.tsx
"use client";
import { useState, useEffect } from "react";
import KuuMessage from "./KuuMessage";

// このコンポーネントは、ページ遷移時に「くぅーだね」のメッセージを
// 画面中央に数秒間表示してから、実際のページを表示するためのラッパーです。
export default function KuuGate({ children }: { children: React.ReactNode }) {
    // 実際のページを表示するかどうかのフラグ
    const [showPage, setShowPage] = useState(false);

    useEffect(() => {
        // コンポーネントがマウントされたとき（ページ遷移したとき）に、
        // 3秒間「くぅーだね」の演出を表示したあと、ページ本体を表示する

        const timer = setTimeout(() => {
            setShowPage(true); // 3秒経過後にページ本体の表示を許可
        }, 3000); // 3秒（KuuMessageと同じ表示時間）

        // クリーンアップ関数：コンポーネントがアンマウントされるときにタイマーを解除
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* showPageがfalseの間はKuuMessage（「くぅーだね」）を表示 */}
            {!showPage && <KuuMessage />}

            {/* showPageがtrueになると、実際のページ内容（children）を表示 */}
            {showPage && children}
        </>
    );
}
