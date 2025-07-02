"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const res = await postJson('/login', { email, password }) as any;
            if (res && res.user) {
                setUser(res.user);
                setIsLoggedIn(true);
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
    };

    const checkAuthStatus = async () => {
        try {
            const userData = await getJson('/user') as User;
            setUser(userData);
            setIsLoggedIn(true);
        } catch (error) {
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, checkAuthStatus }}>
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