'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Only for signup
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        const payload = isLogin ? { email, password } : { name, email, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (isLogin) {
                login(data.user);
            } else {
                signup(data.user);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-purple-900/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="w-full max-w-md space-y-8 z-10 p-8 glass-panel rounded-2xl border border-border shadow-2xl bg-card/50 backdrop-blur-xl">
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 text-3xl font-bold tracking-tight text-foreground"
                    >
                        Intern Playbook
                    </motion.h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {isLogin ? 'Sign in to access your dashboard' : 'Join the Scaler Intern Program'}
                    </p>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Start Journey
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.form
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-8 space-y-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="-space-y-px rounded-md shadow-sm">
                            {!isLogin && (
                                <div className="mb-4">
                                    <label htmlFor="name" className="sr-only">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="relative block w-full rounded-lg border-0 bg-secondary px-3 py-3 text-foreground placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-primary hover:bg-secondary/80 transition-colors sm:text-sm"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full rounded-lg border-0 bg-secondary px-3 py-3 text-foreground placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-primary hover:bg-secondary/80 transition-colors sm:text-sm"
                                    placeholder="Email address (@scaler.com)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    required
                                    className="relative block w-full rounded-lg border-0 bg-secondary px-3 py-3 text-foreground placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-primary hover:bg-secondary/80 transition-colors sm:text-sm pr-10"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-900/20 py-2 rounded">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center rounded-lg bg-indigo-600 py-3 px-4 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    isLogin ? 'Sign in' : 'Create Account'
                                )}
                            </button>
                        </div>
                    </motion.form>
                </AnimatePresence>
            </div>
        </div>
    );
}
