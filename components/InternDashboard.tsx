'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Trophy, CheckCircle, ExternalLink, PlayCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Task {
    _id: string;
    name: string;
    domain: string;
    link?: string;
    tips?: string;
    images?: string[];
    video?: string;
    xpReward: number;
}

export default function InternDashboard({ user }: { user: any }) {
    const { logout, refreshUser } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`/api/tasks?domain=${user.domain}`);
            const data = await res.json();
            setTasks(data.tasks);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (taskId: string, reward: number) => {
        try {
            const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
            if (res.ok) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                await refreshUser(); // Update XP locally
            }
        } catch (error) {
            console.error(error);
        }
    };

    const isCompleted = (taskId: string) => {
        return user.completedTasks?.includes(taskId);
    };

    const progress = tasks.length > 0
        ? Math.round((user.completedTasks?.length || 0) / tasks.length * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <span className="font-bold text-xl">IP</span>
                            </div>
                            <span className="font-semibold text-lg hidden sm:block">Intern Playbook</span>
                            <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-400 border border-gray-700">{user.domain} PoD</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-indigo-400 font-bold">{user.xp} XP • Lvl {Math.floor(user.xp / 500) + 1}</span>
                            </div>
                            <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Stats / Hero */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="col-span-1 md:col-span-2 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Welcome Back! 🚀</h1>
                            <p className="text-indigo-200 mb-6 max-w-lg">
                                You have completed {user.completedTasks?.length || 0} out of {tasks.length} tasks. Keep pushing to climb the leaderboard!
                            </p>
                            <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden">
                                <motion.div
                                    className="bg-green-400 h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                            <div className="mt-2 text-right text-sm font-medium text-green-300">{progress}% Complete</div>
                        </div>
                        <Trophy className="absolute right-0 bottom-0 text-white/5 w-64 h-64 -mr-8 -mb-8 rotate-12" />
                    </motion.div>


                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        className="bg-gray-800 rounded-3xl p-6 border border-gray-700 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 ring-4 ring-indigo-500/20">
                            <span className="text-4xl font-bold text-indigo-400">{Math.floor(user.xp / 500) + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-200">Current Level</h3>
                        <p className="text-gray-500 text-sm">Next level at {Math.ceil((user.xp + 1) / 500) * 500} XP</p>
                    </motion.div>
                </div>

                {/* Tasks Grid */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        Your Mission
                        <span className="bg-gray-800 text-xs ml-3 px-2 py-1 rounded-full text-gray-400">{tasks.length} Tasks</span>
                    </h2>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-gray-800/50 rounded-2xl border border-dashed border-gray-700">
                            No tasks assigned yet. Enjoy the chill time! ☕
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {tasks.map((task, idx) => {
                                const completed = isCompleted(task._id);
                                return (
                                    <motion.div
                                        key={task._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`group relative bg-gray-800 rounded-2xl p-6 border transition-all hover:border-indigo-500/50 ${completed ? 'border-green-500/30 opacity-75' : 'border-gray-700'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className={`text-xl font-bold ${completed ? 'text-green-400 line-through' : 'text-white'}`}>{task.name}</h3>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded font-medium">+{task.xpReward} XP</span>
                                                    {task.video && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded flex items-center"><PlayCircle size={12} className="mr-1" /> Video</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => !completed && handleComplete(task._id, task.xpReward)}
                                                disabled={completed}
                                                className={`p-3 rounded-xl transition-all ${completed ? 'bg-green-500 text-white cursor-default' : 'bg-gray-700 text-gray-400 hover:bg-indigo-600 hover:text-white'}`}
                                            >
                                                <CheckCircle size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {task.tips && (
                                                <div className="bg-black/20 p-3 rounded-lg text-sm text-gray-400">
                                                    <span className="font-bold text-gray-200 block mb-1">💡 Pro Tip:</span>
                                                    {task.tips}
                                                </div>
                                            )}

                                            {task.link && (
                                                <a href={task.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-400 hover:underline">
                                                    <ExternalLink size={14} className="mr-2" /> Open Resource
                                                </a>
                                            )}

                                            {task.images && task.images.length > 0 && (
                                                <div className="flex gap-2 overflow-x-auto py-2">
                                                    {task.images.map((img, i) => (
                                                        <img key={i} src={img} alt="Task ref" className="h-20 w-32 object-cover rounded-lg border border-gray-700" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
