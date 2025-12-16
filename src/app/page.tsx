'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import {
    Github,
    Zap,
    Globe,
    Code2,
    ArrowRight,
    Check,
    Type,
    Sparkles,
} from 'lucide-react';

export default function HomePage() {
    const { data: session } = useSession();

    const features = [
        {
            icon: Github,
            title: 'GitHub Powered',
            description: 'Use your existing GitHub repositories. Just push and deploy.',
        },
        {
            icon: Globe,
            title: 'Global CDN',
            description: 'Served via jsDelivr with 100+ global edge locations.',
        },
        {
            icon: Code2,
            title: 'CSS Generator',
            description: 'Auto-generate @font-face declarations. Copy and paste.',
        },
        {
            icon: Zap,
            title: '100% Free',
            description: 'No costs, no limits. Open source and free forever.',
        },
    ];

    const steps = [
        { step: 1, title: 'Sign in with GitHub', description: 'Connect your account in one click' },
        { step: 2, title: 'Select Repository', description: 'Choose a repo with font files' },
        { step: 3, title: 'Get CDN URLs', description: 'Instant jsDelivr CDN links' },
        { step: 4, title: 'Use in Your CSS', description: 'Copy the @font-face code' },
    ];

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-50 dark:from-sky-950/20 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl" />
                <div className="absolute top-40 right-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 mb-8">
                            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            <span className="text-sm font-medium text-sky-700 dark:text-sky-300">100% Free & Open Source</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            Push Fonts to GitHub,{' '}
                            <span className="gradient-text">Get CDN URLs</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
                            The simplest way to host your web fonts. Push to GitHub, get instant CDN links
                            via jsDelivr. No servers, no costs, just fonts.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {session ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-2xl transition-all shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            ) : (
                                <button
                                    onClick={() => signIn('github')}
                                    className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-2xl transition-all shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 animate-pulse-glow"
                                >
                                    <Github className="w-5 h-5" />
                                    Get Started Free
                                </button>
                            )}

                            <a
                                href="https://github.com/yourusername/webfont-cdn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-8 py-4 text-lg font-medium text-slate-700 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl transition-colors"
                            >
                                <Github className="w-5 h-5" />
                                View on GitHub
                            </a>
                        </div>

                        {/* URL Preview */}
                        <div className="mt-16 p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Your fonts will be served at:</p>
                            <code className="text-sm sm:text-base text-sky-600 dark:text-sky-400 font-mono break-all">
                                https://cdn.jsdelivr.net/gh/username/repo/fonts/MyFont.woff2
                            </code>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            A complete solution for self-hosting web fonts without complexity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-lg hover:shadow-sky-500/5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 dark:from-sky-500/20 dark:to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Get your fonts on a global CDN in under a minute
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((item, index) => (
                            <div key={index} className="relative text-center">
                                {/* Connector */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-sky-500 to-transparent -translate-x-1/2" />
                                )}

                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-sky-500/30">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Code Example */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Ready-to-Use CSS
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                                We automatically generate @font-face declarations for all your fonts.
                                Just copy and paste into your stylesheet.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Auto-detects font weight and style',
                                    'Supports WOFF2, WOFF, TTF, and OTF',
                                    'Includes font-display: swap',
                                    'Works with any CSS framework',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="code-block p-6 overflow-x-auto">
                            <pre className="text-sm text-slate-700 dark:text-slate-300">
                                {`@font-face {
  font-family: 'MyFont';
  src: url('https://cdn.jsdelivr.net/gh/
    username/repo/fonts/MyFont-Regular.woff2')
    format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MyFont';
  src: url('https://cdn.jsdelivr.net/gh/
    username/repo/fonts/MyFont-Bold.woff2')
    format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-sky-500/30">
                        <Type className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Ready to Host Your Fonts?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                        Free forever, no credit card required.
                    </p>

                    {session ? (
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-2xl transition-all shadow-xl shadow-sky-500/25"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    ) : (
                        <button
                            onClick={() => signIn('github')}
                            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-2xl transition-all shadow-xl shadow-sky-500/25"
                        >
                            <Github className="w-5 h-5" />
                            Sign in with GitHub
                        </button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Type className="w-5 h-5 text-sky-500" />
                            <span className="text-slate-600 dark:text-slate-400">Webfont CDN</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-500 text-sm">
                            Open source • MIT License • Made with ❤️
                        </p>
                        <a
                            href="https://github.com/yourusername/webfont-cdn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
