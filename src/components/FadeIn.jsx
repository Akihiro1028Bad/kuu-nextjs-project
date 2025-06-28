// components/FadeIn.jsx

import { useRef, useState, useEffect } from 'react';
import styles from '@/styles/fadeIn.module.css';

// スクロールして要素が画面内に入ったらフェードイン表示するコンポーネント
export default function FadeIn({ children, delay = 0 }) {
    // DOM 要素を参照するための ref
    const ref = useRef(null);

    // 表示状態を管理する state。最初は非表示（false）
    const [isVisible, setIsVisible] = useState(false);

    // useEffect で IntersectionObserver をセット
    useEffect(() => {
        // IntersectionObserver を作成
        const observer = new IntersectionObserver(
            ([entry]) => {
                // entry.isIntersecting が true なら、対象が画面内に入ったということ
                if (entry.isIntersecting) {
                    // 指定された遅延時間の後にフェードインを実行
                    setTimeout(() => setIsVisible(true), delay);

                    // 一度フェードインしたら再監視しない（パフォーマンスのため）
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1, // 対象要素の 10% 以上が見えたら発火
            }
        );

        // ref が現在参照している要素を監視対象に設定
        if (ref.current) {
            observer.observe(ref.current);
        }

        // コンポーネントがアンマウントされたときに監視解除
        return () => observer.disconnect();
    }, [delay]);

    return (
        // ref を div に紐づけて、IntersectionObserver で監視できるようにする
        // クラス名は状態に応じて切り替える（isVisible が true なら visible クラスを追加）
        <div
            ref={ref}
            className={`${styles.fadeIn} ${isVisible ? styles.visible : ''}`}
        >
            {children}
        </div>
    );
}
