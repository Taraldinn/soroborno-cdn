'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const errorMessages: Record<string, string> = {
        Configuration: 'Server configuration problem.',
        AccessDenied: 'Access denied.',
        Verification: 'Link expired or already used.',
        Default: 'Authentication error occurred.',
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-16 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-xl">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Authentication Error
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {errorMessages[error || ''] || errorMessages.Default}
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    );
}
