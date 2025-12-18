'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UserType {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'intern';
    domain: string;
    xp: number;
}

interface AuthContextType {
    user: UserType | null;
    loading: boolean;
    login: (data: any) => void;
    signup: (data: any) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            setUser(data.user);
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    // Protect routes logic could go here or in middleware.
    // For simplicity, we can do client-side checks for redirection.
    useEffect(() => {
        if (!loading) {
            if (!user && pathname.startsWith('/dashboard')) {
                router.push('/user/login');
            } else if (user && pathname === '/user/login') {
                router.push('/dashboard');
            } else if (user && pathname === '/user/signup') {
                router.push('/dashboard');
            }
        }
    }, [user, loading, pathname, router]);


    const login = (userData: any) => {
        setUser(userData);
        router.push('/dashboard');
    };

    const signup = (userData: any) => {
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = async () => {        // Call logout API to clear cookie
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/auth');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
