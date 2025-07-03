// components/KuuGate.tsx
"use client";
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// このコンポーネントは、ページ遷移時に「くぅーだね」のメッセージを
// 画面中央に数秒間表示してから、実際のページを表示するためのラッパーです。

interface KuuGateProps {
    children: ReactNode;
    requireAuth?: boolean;
}

export default function KuuGate({ children, requireAuth = false }: KuuGateProps) {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (requireAuth && !loading) {
            if (!isLoggedIn) {
                setIsChecking(true);
                router.push('/login');
            }
        }
    }, [requireAuth, isLoggedIn, loading, router]);

    // ログイン画面にリダイレクト中の場合はローディング表示
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">リダイレクト中...</p>
                </div>
            </div>
        );
    }

    // 認証が必要でローディング中の場合はローディング表示
    if (requireAuth && loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
