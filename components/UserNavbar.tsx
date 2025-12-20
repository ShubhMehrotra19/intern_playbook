'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, Book } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserNavbar({ user }: { user: any }) {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-3">
                        <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                                <span className="font-bold text-xl">IP</span>
                            </div>
                            <span className="font-semibold text-lg hidden sm:block">Intern Playbook</span>
                        </Link>
                        {user?.domain && (
                            <span className="bg-muted text-xs px-2 py-1 rounded text-muted-foreground border border-border">
                                {user.domain} PoD
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-medium">{user?.name}</span>
                            <span className="text-xs text-primary font-bold">
                                {user?.xp !== undefined ? user.xp : 0} XP • Lvl{' '}
                                {user?.xp !== undefined ? Math.floor(user.xp / 500) + 1 : 0}
                            </span>
                        </div>

                        {/* Resource Library Link */}
                        <Link
                            href="/resources"
                            className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${pathname === '/resources' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                            title="Resource Library"
                        > Library
                            <Book size={20} />
                        </Link>

                        <ThemeToggle />
                        <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
