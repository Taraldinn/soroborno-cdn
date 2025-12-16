'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, X, Type, Bold, Italic, Minus, Plus, RotateCcw, ChevronDown } from 'lucide-react';
import { useFont } from './FontProvider';
import fontsData from '@/data/fonts.json';

export function SettingsDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const { config, updateConfig, resetConfig } = useFont();
    const drawerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'ui' | 'preview'>('preview');

    // Close drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const slug = e.target.value;
        if (!slug) {
            updateConfig({ fontFamily: null, cssUrl: null });
            return;
        }
        const font = fontsData.find(f => f.slug === slug);
        if (font) {
            updateConfig({ fontFamily: font.name, cssUrl: font.cssUrl });
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg shadow-sky-500/30 transition-all hover:scale-110 ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
                title="কাস্টমাইজ করুন"
            >
                <Settings className="w-6 h-6 animate-spin-slow" />
            </button>

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed inset-y-0 right-0 z-50 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Settings className="w-5 h-5 text-sky-500" />
                                সেটিংস
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${activeTab === 'preview'
                                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                ফন্ট প্রিভিউ
                            </button>
                            <button
                                onClick={() => setActiveTab('ui')}
                                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${activeTab === 'ui'
                                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                UI কাস্টমাইজ
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">

                        {activeTab === 'preview' ? (
                            // Preview Settings
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-900 dark:text-white">
                                        প্রিভিউ টেক্সট
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={config.previewText}
                                        onChange={(e) => updateConfig({ previewText: e.target.value })}
                                        placeholder="আপনার টেক্সট লিখুন..."
                                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-900 dark:text-white">
                                            কার্ড ফন্ট সাইজ
                                        </label>
                                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                                            {config.cardPreviewSize}px
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateConfig({ cardPreviewSize: Math.max(12, config.cardPreviewSize - 4) })}
                                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="range"
                                            min="12"
                                            max="120"
                                            step="4"
                                            value={config.cardPreviewSize}
                                            onChange={(e) => updateConfig({ cardPreviewSize: parseInt(e.target.value) })}
                                            className="flex-1 accent-sky-500"
                                        />
                                        <button
                                            onClick={() => updateConfig({ cardPreviewSize: Math.min(120, config.cardPreviewSize + 4) })}
                                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // UI Settings
                            <div className="space-y-6">
                                {/* Font Family */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                        <Type className="w-4 h-4 text-sky-500" />
                                        ফন্ট ফ্যামিলি (UI)
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={fontsData.find(f => f.name === config.fontFamily)?.slug || ''}
                                            onChange={handleFontChange}
                                            className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        >
                                            <option value="">ডিফল্ট (System)</option>
                                            {fontsData.map(font => (
                                                <option key={font.slug} value={font.slug}>
                                                    {font.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Font Size */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-900 dark:text-white">
                                            গ্লোবাল ফন্ট সাইজ
                                        </label>
                                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                                            {config.fontSize}px
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateConfig({ fontSize: Math.max(12, config.fontSize - 1) })}
                                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="range"
                                            min="12"
                                            max="24"
                                            value={config.fontSize}
                                            onChange={(e) => updateConfig({ fontSize: parseInt(e.target.value) })}
                                            className="flex-1 accent-sky-500"
                                        />
                                        <button
                                            onClick={() => updateConfig({ fontSize: Math.min(24, config.fontSize + 1) })}
                                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Style Toggles */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-900 dark:text-white">
                                        স্টাইল (UI)
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => updateConfig({ isBold: !config.isBold })}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${config.isBold
                                                ? 'bg-sky-500 border-sky-500 text-white'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500'
                                                }`}
                                        >
                                            <Bold className="w-4 h-4" />
                                            বোল্ড
                                        </button>
                                        <button
                                            onClick={() => updateConfig({ isItalic: !config.isItalic })}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${config.isItalic
                                                ? 'bg-sky-500 border-sky-500 text-white'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500'
                                                }`}
                                        >
                                            <Italic className="w-4 h-4" />
                                            ইটালিক
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <button
                            onClick={resetConfig}
                            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            রিসেট ডিফল্ট
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
