'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import InternDashboard from '@/components/InternDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import OnboardingForm from '@/components/OnboardingForm';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        // Should be handled by AuthContext redirect, but safe fallback
        return null;
    }

    if (user.role === 'admin') {
        return <AdminDashboard user={user} />;
    }

    // If intern hasn't selected a domain yet, show onboarding
    if (user.role === 'intern' && user.domain === 'None') {
        return <OnboardingForm user={user} />;
    }

    return <InternDashboard user={user} />;
}
