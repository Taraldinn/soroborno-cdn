'use client';

import { useState } from 'react';
import { useFont } from './FontProvider';
import { Type, Bold, Italic, Minus, Plus, RotateCcw, ChevronDown, Search, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import fontsData from '@/data/fonts.json';

interface FontsSidebarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function FontsSidebar({ searchQuery, onSearchChange }: FontsSidebarProps) {
    const { config, updateConfig, resetConfig } = useFont();
    const [isCollapsed, setIsCollapsed] = useState(false);

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
        <aside className={`relative hidden lg:block shrink-0 self-start sticky top-24 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-12' : 'w-80'}`}>

            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-0 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm text-slate-500 hover:text-sky-500 transition-colors z-10"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {/* 
                   If sidebar is on LEFT:
                   - Expanded: PanelLeftClose (points left, like <|)
                   - Collapsed: PanelLeftOpen (points right, like |>)
                   Lucide icons logic assumption:
                   PanelLeftClose usually means "close the panel that is on the left" -> <|
                */}
                {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4 ml-0.5" />}
            </button>

            <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${isCollapsed ? 'h-full opacity-50' : ''}`}>

                {/* Collapsed State: Vertical Icons or Empty */}
                {isCollapsed && (
                    <div className="flex flex-col items-center py-6 gap-6">
                        <Search className="w-5 h-5 text-slate-400" />
                        <Type className="w-5 h-5 text-slate-400" />
                    </div>
                )}

                {/* Expanded Content */}
                <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                    <div className="p-5 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">

                        {/* Header/Reset */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Type className="w-5 h-5 text-sky-500" />
                                সেটিংস
                            </h2>
                            <button
                                onClick={resetConfig}
                                title="রিসেট ডিফল্ট"
                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ফন্ট খুঁজুন..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>

                        {/* Preview Text */}
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

                        {/* Card Font Size */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-900 dark:text-white">
                                    ফন্ট সাইজ (কার্ড)
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

                        <div className="h-px bg-slate-200 dark:bg-slate-800" />

                        {/* UI Settings Section */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                UI কাস্টমাইজেশন
                            </h3>

                            {/* Font Family */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-900 dark:text-white">
                                    ফন্ট ফ্যামিলি
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

                            {/* Global Font Size */}
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
                                    স্টাইল
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
                    </div>
                </div>
            </div>
        </aside>
    );
}
