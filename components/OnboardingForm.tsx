'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function OnboardingForm({ user }: { user: any }) {
    const [phone, setPhone] = useState('');
    const [domain, setDomain] = useState('Program'); // Default
    const [loading, setLoading] = useState(false);
    const { refreshUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, domain }),
            });

            if (res.ok) {
                await refreshUser(); // This will update context and trigger redirect to InternDashboard
            } else {
                alert('Failed to save details');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700"
            >
                <h2 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}!</h2>
                <p className="text-gray-400 mb-8">Let's get you set up. Which domain are you joining?</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="+91 99999 99999"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Your Domain</label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {['Program', 'HR', 'IT', 'Sales', 'RM'].map((d) => (
                                <div
                                    key={d}
                                    onClick={() => setDomain(d)}
                                    className={`cursor-pointer text-center px-3 py-2 rounded-lg border transition-all ${domain === d ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition-transform active:scale-95"
                    >
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
