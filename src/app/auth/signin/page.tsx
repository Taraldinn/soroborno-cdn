'use client';

import { signIn } from 'next-auth/react';
import { Github, Type } from 'lucide-react';

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center pt-16 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Type className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome to Webfont CDN
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        Sign in with GitHub to manage your fonts
                    </p>

                    <button
                        onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <Github className="w-6 h-6" />
                        Continue with GitHub
                    </button>

                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-6">
                        We only read font files, never modify your code.
                    </p>
                </div>
            </div>
        </div>
    );
}
