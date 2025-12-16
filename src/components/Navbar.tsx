'use client';

import Link from 'next/link';
import { Github, Type, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                            <Type className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white font-[var(--font-family-sans)]">
                            স্বরবর্ন <span className="text-sky-500">সিডিএন</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8 font-[var(--font-family-mono)]">
                        <Link
                            href="/fonts"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                        >
                            ফন্টস
                        </Link>
                        <Link
                            href="/#features"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                        >
                            বৈশিষ্ট্য
                        </Link>
                        <Link
                            href="/#how-it-works"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                        >
                            কিভাবে কাজ করে
                        </Link>
                        <a
                            href="https://github.com/yourusername/webfont-cdn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5"
                        >
                            <Github className="w-4 h-4" />
                            গিটহাব
                        </a>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
