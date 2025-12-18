'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Plus, Users, Layout, Trash2, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard({ user }: { user: any }) {
    const { logout } = useAuth();
    const [selectedDomain, setSelectedDomain] = useState('Program');
    const [tasks, setTasks] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'tasks' | 'users'>('tasks');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState<any | null>(null);

    // Form State
    const [newTask, setNewTask] = useState({
        name: '',
        link: '',
        tips: '',
        video: '',
        images: '',
        xpReward: 100
    });

    useEffect(() => {
        if (activeTab === 'tasks') {
            fetchTasks();
        } else {
            fetchUsers();
        }
    }, [selectedDomain, activeTab]);

    const fetchTasks = async () => {
        const res = await fetch(`/api/tasks?domain=${selectedDomain}`);
        const data = await res.json();
        setTasks(data.tasks || []);
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/users?domain=${selectedDomain}`);
            const data = await res.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleCreateOrUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks';
            const method = editingTask ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newTask,
                    domain: selectedDomain,
                    images: newTask.images ? newTask.images.split(',').map(s => s.trim()) : []
                })
            });

            if (res.ok) {
                setShowTaskForm(false);
                setNewTask({ name: '', link: '', tips: '', video: '', images: '', xpReward: 100 });
                setEditingTask(null);
                fetchTasks();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            if (res.ok) fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (task: any) => {
        setEditingTask(task);
        setNewTask({
            name: task.name,
            link: task.link || '',
            tips: task.tips || '',
            video: task.video || '',
            images: task.images ? task.images.join(', ') : '',
            xpReward: task.xpReward
        });
        setShowTaskForm(true);
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setNewTask({ name: '', link: '', tips: '', video: '', images: '', xpReward: 100 });
        setShowTaskForm(true);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-3">
                            <span className="font-bold text-xl text-yellow-500">ADMIN</span>
                            <span className="font-semibold text-lg hidden sm:block">Intern Playbook</span>
                        </div>
                        <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase px-3 mb-2">Domains</h3>
                        {['Program', 'HR', 'IT', 'Sales', 'RM'].map((d) => (
                            <button
                                key={d}
                                onClick={() => setSelectedDomain(d)}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDomain === d ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedDomain} Dashboard</h2>
                                <div className="flex space-x-4 mt-2">
                                    <button
                                        onClick={() => setActiveTab('tasks')}
                                        className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'tasks' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                                    >
                                        Tasks
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('users')}
                                        className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'users' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                                    >
                                        Leaderboard & Progress
                                    </button>
                                </div>
                            </div>
                            {activeTab === 'tasks' && (
                                <button
                                    onClick={openCreateModal}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all"
                                >
                                    <Plus size={16} className="mr-2" /> Add Task
                                </button>
                            )}
                        </div>

                        {/* Task List */}
                        {activeTab === 'tasks' ? (
                            <div className="grid gap-4">
                                {tasks.map((task) => (
                                    <div key={task._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold">{task.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1">{task.tips || 'No summary'}</p>
                                        </div>
                                        <div className="text-right flex items-center space-x-3">
                                            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full font-bold border border-indigo-500/30">
                                                {task.xpReward} XP
                                            </span>
                                            <button onClick={() => handleEditClick(task)} className="text-gray-400 hover:text-white transition-colors">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-400 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {tasks.length === 0 && <div className="text-gray-500 text-center py-8">No tasks found for {selectedDomain}</div>}
                            </div>
                        ) : (
                            /* Users List */
                            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-700/50 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-3">Rank</th>
                                            <th className="px-6 py-3">Intern</th>
                                            <th className="px-6 py-3">XP</th>
                                            <th className="px-6 py-3">Tasks Done</th>
                                            <th className="px-6 py-3">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {users.map((u, idx) => (
                                            <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-indigo-400">{u.xp} XP</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
                                                        {u.completedTasks?.length || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-gray-500">No interns found in {selectedDomain}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Create Task Modal */}
            <AnimatePresence>
                {showTaskForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-gray-800 rounded-2xl w-full max-w-lg p-6 border border-gray-700 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{editingTask ? 'Edit Task' : `New Task for ${selectedDomain}`}</h3>
                                <button onClick={() => setShowTaskForm(false)} className="text-gray-400 hover:text-white"><Plus size={24} className="rotate-45" /></button>
                            </div>

                            <form onSubmit={handleCreateOrUpdateTask} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Task Name</label>
                                    <input required type="text" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tips / Description</label>
                                    <textarea value={newTask.tips} onChange={e => setNewTask({ ...newTask, tips: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" rows={3} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Resource Link</label>
                                    <input type="url" value={newTask.link} onChange={e => setNewTask({ ...newTask, link: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" placeholder="https://..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">XP Reward</label>
                                        <input type="number" value={newTask.xpReward} onChange={e => setNewTask({ ...newTask, xpReward: Number(e.target.value) })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Video Link (Optional)</label>
                                        <input type="text" value={newTask.video} onChange={e => setNewTask({ ...newTask, video: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Images (Comma separated URLs)</label>
                                    <input type="text" value={newTask.images} onChange={e => setNewTask({ ...newTask, images: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500" placeholder="url1, url2" />
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg mt-4">
                                    {editingTask ? 'Update Task' : 'Create Task'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
