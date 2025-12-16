'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Github, LogOut, LayoutDashboard, Type, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Navbar() {
    const { data: session, status } = useSession();
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
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            Webfont<span className="text-sky-500">CDN</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/fonts"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                        >
                            Fonts
                        </Link>
                        <Link
                            href="/#features"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="/#how-it-works"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                        >
                            How it Works
                        </Link>
                        <a
                            href="https://github.com/yourusername/webfont-cdn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
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

                        {/* Auth */}
                        {status === 'loading' ? (
                            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
                        ) : session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors shadow-lg shadow-sky-500/25"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-2">
                                    {session.user?.image && (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            width={36}
                                            height={36}
                                            className="rounded-xl ring-2 ring-slate-200 dark:ring-slate-700"
                                        />
                                    )}
                                    <button
                                        onClick={() => signOut()}
                                        className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                        title="Sign out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => signIn('github')}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign in</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
