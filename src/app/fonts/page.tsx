'use client';

import { useState, useEffect } from 'react';
import { Search, Type, SlidersHorizontal, Loader2 } from 'lucide-react';
import { FontLibraryCard } from '@/components/FontLibraryCard';
import fontsData from '@/data/fonts.json';

interface FontInfo {
    slug: string;
    name: string;
    description: string;
    designer: string;
    version: string;
    license: string;
    weights: string[];
    files: string[];
    cssUrl: string;
    previewUrl: string;
}

export default function FontsPage() {
    const [fonts, setFonts] = useState<FontInfo[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Customization state
    const [showControls, setShowControls] = useState(false);
    const [previewText, setPreviewText] = useState('');
    const [previewSize, setPreviewSize] = useState(32);

    const defaultPreviewTexts = [
        'The quick brown fox jumps over the lazy dog',
        'আমার সোনার বাংলা আমি তোমায় ভালোবাসি',
        'Pack my box with five dozen liquor jugs',
        '০১২৩৪৫৬৭৮৯ ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    ];

    useEffect(() => {
        // In static mode, we just load the JSON data
        // Simulate a small delay for better UX or just set immediately
        setTimeout(() => {
            setFonts(fontsData as FontInfo[]);
            setLoading(false);
        }, 500);
    }, []);

    const filteredFonts = fonts.filter(font =>
        font.name.toLowerCase().includes(search.toLowerCase()) ||
        font.designer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 mb-6">
                        <Type className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
                            {fonts.length} টি ফন্ট লভ্য
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        ফন্ট লাইব্রেরি
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        ফ্রি বাংলা এবং বহুভাষিক ফন্ট। ওপেন সোর্স, হাই কোয়ালিটি এবং ব্যবহারের জন্য প্রস্তুত।
                    </p>
                </div>

                {/* Controls */}
                <div className="sticky top-16 z-40 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ফন্ট খুঁজুন..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>

                        {/* Toggle controls */}
                        <button
                            onClick={() => setShowControls(!showControls)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${showControls
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="hidden sm:inline">কাস্টমাইজ</span>
                        </button>
                    </div>

                    {/* Preview controls */}
                    {showControls && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                            {/* Preview text */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    প্রিভিউ টেক্সট
                                </label>
                                <input
                                    type="text"
                                    placeholder="লিখুন..."
                                    value={previewText}
                                    onChange={(e) => setPreviewText(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {defaultPreviewTexts.map((text, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPreviewText(text)}
                                            className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors truncate max-w-[200px]"
                                        >
                                            {text.slice(0, 30)}...
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font size */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    ফন্ট সাইজ: {previewSize}px
                                </label>
                                <input
                                    type="range"
                                    min="16"
                                    max="72"
                                    value={previewSize}
                                    onChange={(e) => setPreviewSize(parseInt(e.target.value))}
                                    className="w-full accent-sky-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Results count */}
                {search && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        "{search}" এর জন্য {filteredFonts.length} টি ফন্ট পাওয়া গেছে
                    </p>
                )}

                {/* Font grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                    </div>
                ) : filteredFonts.length === 0 ? (
                    <div className="text-center py-20">
                        <Type className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            কোনো ফন্ট পাওয়া যায়নি
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {search ? 'অন্য কোনো নাম দিয়ে চেষ্টা করুন' : 'ফন্ট ফোল্ডারে ফন্ট যোগ করুন'}
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredFonts.map((font) => (
                            <FontLibraryCard
                                key={font.slug}
                                font={font}
                                previewText={previewText}
                                previewSize={previewSize}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
