'use client';

import { useEffect, useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Contributor {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

export default function ContributorsPage() {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const response = await fetch('https://api.github.com/repos/Taraldinn/soroborno-cdn/contributors');
                if (!response.ok) {
                    throw new Error('Failed to fetch contributors');
                }
                const data = await response.json();
                setContributors(data);
            } catch (err) {
                console.error('Error fetching contributors:', err);
                setError('কন্ট্রিবিউটর তালিকা লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।');
            } finally {
                setLoading(false);
            }
        };

        fetchContributors();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50 dark:from-sky-950/20 via-transparent to-transparent -z-10" />
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl -z-10">
                <div className="w-64 h-64 bg-sky-500 rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        আমাদের <span className="text-sky-500">কন্ট্রিবিউটর</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        যাদের অক্লান্ত পরিশ্রমে এই প্রজেক্টটি গড়ে উঠেছে। আপনিও যোগ দিন আমাদের সাথে!
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {contributors.map((contributor) => (
                            <a
                                key={contributor.id}
                                href={contributor.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 transition-colors flex flex-col items-center text-center shadow-sm hover:shadow-md"
                            >
                                <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 group-hover:border-sky-500 transition-colors">
                                    <Image
                                        src={contributor.avatar_url}
                                        alt={contributor.login}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate w-full">
                                    {contributor.login}
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                    <Github className="w-3 h-3" />
                                    <span>{contributor.contributions} commits</span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
