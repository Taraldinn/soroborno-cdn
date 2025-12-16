'use client';

import { Github, Lock, Unlock, ArrowRight, Loader2 } from 'lucide-react';

interface Repository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    default_branch: string;
    html_url: string;
}

interface RepoSelectorProps {
    repos: Repository[];
    loading: boolean;
    onSelect: (repo: Repository) => void;
    selectedRepo: Repository | null;
}

export function RepoSelector({ repos, loading, onSelect, selectedRepo }: RepoSelectorProps) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Loading repositories...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Select Repository</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose a repo with font files</p>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {repos.length === 0 ? (
                    <div className="p-8 text-center">
                        <Github className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400 mb-2">No repositories found</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">Create a repo with font files</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {repos.map((repo) => (
                            <button
                                key={repo.id}
                                onClick={() => onSelect(repo)}
                                className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-4 group ${selectedRepo?.id === repo.id ? 'bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500' : ''
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                            {repo.name}
                                        </h3>
                                        {repo.private ? (
                                            <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                        ) : (
                                            <Unlock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                        )}
                                    </div>
                                    {repo.description && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">{repo.description}</p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1">Branch: {repo.default_branch}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
