'use client';

import Link from 'next/link';
import { Github, Terminal, Zap, Globe, Type, Check } from 'lucide-react';
import { Stats } from '../components/Stats';

export default function HomePage() {
    const steps = [
        { step: 1, title: 'গিটহাবে ফন্ট পুশ করুন', description: 'আপনার রিপোজিটরিতে ফন্ট ফাইল রাখুন' },
        { step: 2, title: 'সিডিএন লিংক কপি করুন', description: 'স্বয়ংক্রিয়ভাবে তৈরি হওয়া লিংক ব্যবহার করুন' },
        { step: 3, title: 'ওয়েবসাইটে ব্যবহার করুন', description: 'CSS দিয়ে যেকোনো সাইটে ফন্ট যোগ করুন' },
    ];

    const features = [
        {
            icon: Github,
            title: 'গিটহাব পাওয়ার্ড',
            description: 'আপনার গিটহাব রিপোজিটরি থেকে সরাসরি ফন্ট ব্যবহার করুন।',
        },
        {
            icon: Zap,
            title: 'সুপার ফাস্ট',
            description: 'jsDelivr গ্লোবাল সিডিএন নেটওয়ার্ক দিয়ে মুহূর্তেই লোড হয়।',
        },
        {
            icon: Globe,
            title: 'বাংলার জন্য তৈরি',
            description: 'বাংলা ফন্টের জন্য বিশেষ অপ্টিমাইজেশন এবং সাপোর্ট।',
        },
    ];

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-50 dark:from-sky-950/20 via-transparent to-transparent" />
                <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl">
                    <div className="w-64 h-64 bg-sky-500 rounded-full" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-8 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                ১০০% ফ্রি এবং ওপেন সোর্স
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            বাংলা হোক,{' '}
                            <span className="gradient-text">সমৃদ্ধ</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            বাংলা ফন্ট হোস্টিং এর সবচেয়ে সহজ উপায়। কোনো সার্ভার কনফিগারেশন ছাড়াই সাইট থেকে সিডিএন লিঙ্ক এর মাধ্যমে ফন্ট সার্ভ করুন।
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/fonts"
                                className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold shadow-lg shadow-sky-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Terminal className="w-5 h-5" />
                                ফন্ট লাইব্রেরি দেখুন
                            </Link>
                            <a
                                href="https://github.com/Taraldinn/soroborno-cdn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Github className="w-5 h-5" />
                                গিটহাব রিপোজিটরি
                            </a>
                        </div>

                        {/* Simulated Code Block */}
                        <div className="mt-16 mx-auto max-w-3xl transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="ml-2 text-xs text-slate-500 font-mono">style.css</span>
                                </div>
                                <div className="font-mono text-sm text-left overflow-x-auto">
                                    <div className="text-slate-400">
                                        <span className="text-purple-400">@import</span> url(<span className="text-green-400">'https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@master/fonts/baloo-da-2/font.css'</span>);
                                    </div>
                                    <div className="text-slate-400 mt-4">
                                        <span className="text-purple-400">body</span> {'{'}
                                    </div>
                                    <div className="text-slate-400 ml-4">
                                        <span className="text-sky-400">font-family</span>: <span className="text-green-400">'Baloo Da 2'</span>, sans-serif;
                                    </div>
                                    <div className="text-slate-400">
                                        {'}'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <Stats />

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">কেন স্বরবর্ন সিডিএন?</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            ডেভেলপারদের জন্য তৈরি, ডেভেলপারদের দ্বারা। কোনো জটিলতা ছাড়াই ফন্ট হোস্ট করুন।
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow group"
                            >
                                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                            <Type className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">স্বরবর্ন সিডিএন</span>
                    </div>

                    <p className="text-slate-500 text-sm">
                        ওপেন সোর্স • MIT লাইসেন্স • মেড উইথ ❤️
                    </p>

                    <div className="flex gap-6">
                        <a href="https://github.com/Taraldinn/soroborno-cdn" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
