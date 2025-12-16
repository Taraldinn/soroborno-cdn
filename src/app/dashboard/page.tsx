'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, Type, ExternalLink } from 'lucide-react';
import { RepoSelector } from '@/components/RepoSelector';
import { FontCard } from '@/components/FontCard';
import { CSSGenerator } from '@/components/CSSGenerator';

interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    default_branch: string;
    html_url: string;
}

interface Font {
    path: string;
    fileName: string;
    sha: string;
    size: number;
    format: string;
    familyName: string;
    weight: number;
    style: string;
    cdnUrl: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [repos, setRepos] = useState<Repository[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(true);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
    const [fonts, setFonts] = useState<Font[]>([]);
    const [loadingFonts, setLoadingFonts] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/');
    }, [status, router]);

    useEffect(() => {
        if (session) fetchRepos();
    }, [session]);

    const fetchRepos = async () => {
        setLoadingRepos(true);
        try {
            const res = await fetch('/api/repos');
            if (res.ok) setRepos(await res.json());
        } catch (error) {
            console.error('Failed to fetch repos:', error);
        } finally {
            setLoadingRepos(false);
        }
    };

    const handleSelectRepo = async (repo: Repository) => {
        setSelectedRepo(repo);
        setLoadingFonts(true);
        setFonts([]);

        try {
            const res = await fetch(`/api/repos/${repo.full_name}`);
            if (res.ok) {
                const data = await res.json();
                setFonts(data.fonts);
            }
        } catch (error) {
            console.error('Failed to fetch fonts:', error);
        } finally {
            setLoadingFonts(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400">Select a repository to manage your fonts</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Repositories</h2>
                                <button
                                    onClick={fetchRepos}
                                    className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-xl transition-colors"
                                    title="Refresh"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                            <RepoSelector repos={repos} loading={loadingRepos} onSelect={handleSelectRepo} selectedRepo={selectedRepo} />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {!selectedRepo ? (
                            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                                <Type className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Select a Repository</h3>
                                <p className="text-slate-500 dark:text-slate-400">Choose a repo to discover fonts and get CDN URLs</p>
                            </div>
                        ) : loadingFonts ? (
                            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                                <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400">Scanning for fonts...</p>
                            </div>
                        ) : fonts.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                                <Type className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Fonts Found</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                    No font files (.woff, .woff2, .ttf, .otf) in this repository.
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => handleSelectRepo(selectedRepo)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Refresh
                                    </button>
                                    <a
                                        href={selectedRepo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Open on GitHub
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedRepo.name}</h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">{fonts.length} font{fonts.length !== 1 ? 's' : ''} found</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleSelectRepo(selectedRepo)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" /> Refresh
                                        </button>
                                        <a
                                            href={selectedRepo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" /> GitHub
                                        </a>
                                    </div>
                                </div>

                                <CSSGenerator fonts={fonts} repoFullName={selectedRepo.full_name} />

                                <div className="grid md:grid-cols-2 gap-6">
                                    {fonts.map((font) => <FontCard key={font.path} font={font} />)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
