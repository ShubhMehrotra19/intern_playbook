'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserNavbar from '@/components/UserNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink } from 'lucide-react';

interface Resource {
    _id: string;
    title: string;
    description: string;
    link: string;
    createdAt: string;
}

export default function ResourcesPage() {
    const { user, loading: authLoading } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            setFilteredResources(
                resources.filter(r =>
                    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredResources(resources);
        }
    }, [searchQuery, resources]);

    const fetchResources = async () => {
        try {
            const res = await fetch('/api/resources');
            const data = await res.json();
            setResources(data.resources || []);
            setFilteredResources(data.resources || []);
        } catch (error) {
            console.error('Failed to fetch resources', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <UserNavbar user={user} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            Resource Library
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Curated tools and guides for your internship journey.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading resources...</div>
                ) : filteredResources.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-2xl border border-dashed border-border">
                        No resources found matching your search.
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredResources.map((resource, idx) => (
                            <motion.div
                                key={resource._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setSelectedResource(resource)}
                                className="break-inside-avoid bg-card hover:bg-muted/50 p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2">
                                    {resource.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {resource.description}
                                </p>
                                <div className="mt-4 flex items-center text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details <ExternalLink size={12} className="ml-1" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Resource Modal */}
            <AnimatePresence>
                {selectedResource && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedResource(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold pr-8 mb-4">{selectedResource.title}</h2>

                            <div className="prose dark:prose-invert max-w-none text-muted-foreground mb-6 overflow-y-auto max-h-[60vh]">
                                <p className="whitespace-pre-wrap">{selectedResource.description}</p>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-border">
                                <a
                                    href={selectedResource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                                >
                                    Open Resource <ExternalLink size={16} className="ml-2" />
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
