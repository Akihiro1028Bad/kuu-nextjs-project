"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { getJson, postJson } from '@/app/lib/api';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    profile_image_path: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    isLoggedIn: boolean | null;
    loading: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const lastCheckRef = useRef<number>(0);
    const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const res = await postJson('/login', { email, password }) as any;
            if (res && res.user) {
                setUser(res.user);
                setIsLoggedIn(true);
                lastCheckRef.current = Date.now();
                return { success: true };
            } else {
                setUser(null);
                setIsLoggedIn(false);
                return { success: false, message: res?.message || 'ログインに失敗しました。' };
            }
        } catch (e: any) {
            setUser(null);
            setIsLoggedIn(false);
            return { success: false, message: e?.message || 'ログインに失敗しました。' };
        }
    };

    const logout = async () => {
        await postJson('/logout', {});
        setUser(null);
        setIsLoggedIn(false);
        lastCheckRef.current = 0;
    };

    const checkAuthStatus = async (force: boolean = false) => {
        const now = Date.now();
        const timeSinceLastCheck = now - lastCheckRef.current;
        
        // 5秒以内の重複チェックを防ぐ（force=trueの場合は除く）
        if (!force && timeSinceLastCheck < 5000) {
            return;
        }

        // 既にチェック中の場合は待機
        if (checkTimeoutRef.current) {
            return;
        }

        setLoading(true);
        try {
            const userData = await getJson('/user') as User;
            setUser(userData);
            setIsLoggedIn(true);
            lastCheckRef.current = now;
        } catch (error) {
            setUser(null);
            setIsLoggedIn(false);
            lastCheckRef.current = now;
        } finally {
            setLoading(false);
        }
    };

    // 初回ロード時のみ認証チェック
    useEffect(() => {
        checkAuthStatus(true);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, checkAuthStatus, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 