// components/KuuGate.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// このコンポーネントは、ページ遷移時に「くぅーだね」のメッセージを
// 画面中央に数秒間表示してから、実際のページを表示するためのラッパーです。

interface KuuGateProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export default function KuuGate({ children, requireAuth = false }: KuuGateProps) {
    const { isLoggedIn, checkAuthStatus } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (requireAuth) {
                await checkAuthStatus();
                if (!isLoggedIn) {
                    router.push('/login');
                    return;
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [requireAuth, isLoggedIn, checkAuthStatus, router]);

    if (isLoading) {
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
