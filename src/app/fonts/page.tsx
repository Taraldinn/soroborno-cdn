'use client';

import { useEffect, useState } from 'react';
import { Search, Type, Loader2, SlidersHorizontal } from 'lucide-react';
import { FontLibraryCard } from '@/components/FontLibraryCard';

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
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [previewText, setPreviewText] = useState('');
    const [previewSize, setPreviewSize] = useState(32);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        fetchFonts();
    }, []);

    const fetchFonts = async () => {
        try {
            const res = await fetch('/api/fonts');
            if (res.ok) {
                const data = await res.json();
                setFonts(data.fonts || []);
            }
        } catch (error) {
            console.error('Failed to fetch fonts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFonts = fonts.filter(font =>
        font.name.toLowerCase().includes(search.toLowerCase()) ||
        font.designer.toLowerCase().includes(search.toLowerCase())
    );

    const defaultPreviewTexts = [
        'The quick brown fox jumps over the lazy dog',
        'আমার সোনার বাংলা আমি তোমায় ভালোবাসি',
        'Pack my box with five dozen liquor jugs',
        '০১২৩৪৫৬৭৮৯ ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ];

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 mb-6">
                        <Type className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
                            {fonts.length} Fonts Available
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Font Library
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Free Bengali and multilingual fonts. Open source, high quality, ready to use.
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
                                placeholder="Search fonts..."
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
                            <span className="hidden sm:inline">Customize</span>
                        </button>
                    </div>

                    {/* Preview controls */}
                    {showControls && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                            {/* Preview text */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Preview Text
                                </label>
                                <input
                                    type="text"
                                    placeholder="Type to preview..."
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
                                    Font Size: {previewSize}px
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
                        {filteredFonts.length} font{filteredFonts.length !== 1 ? 's' : ''} found for "{search}"
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
                            No fonts found
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {search ? 'Try a different search term' : 'Add fonts to the fonts folder'}
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
