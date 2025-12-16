'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FontLibraryCard } from '@/components/FontLibraryCard';
import { useFont } from '@/components/FontProvider';
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
    const { config } = useFont();
    const [fonts, setFonts] = useState<FontInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFonts();
    }, []);

    const fetchFonts = async () => {
        try {
            // Check if we have fonts in the static JSON file
            const res = await import('@/data/fonts.json');
            // Check if it has 'default' export or just array (it is generic JSON array)
            // JSON import gets module with 'default' property in some configs, or straight object 
            const data: FontInfo[] = (res as any).default || res;

            if (Array.isArray(data)) {
                setFonts(data);
            } else {
                console.error('Data is not array:', data);
                setFonts([]);
            }
        } catch (error) {
            console.error('Error loading fonts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFonts = fonts.filter(font =>
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.designer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-medium mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            {fonts.length} টি ফন্ট লভ্য
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            ফন্ট লাইব্রেরি
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                            ফ্রি বাংলা এবং বহুমাত্রিক ফন্ট। ওপেন সোর্স, হাই কোয়ালিটি এবং ব্যবহারের জন্য প্রস্তুত।
                        </p>
                    </div>

                    {/* Search Bar only */}
                    <div className="max-w-3xl mx-auto flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ফন্ট খুঁজুন..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-sky-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredFonts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">কোন ফন্ট পাওয়া যায়নি</h3>
                        <p className="text-slate-500 dark:text-slate-400">অন্য কিওয়ার্ড দিয়ে চেষ্টা করুন</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredFonts.map((font) => (
                            <FontLibraryCard
                                key={font.slug}
                                font={font}
                                previewText={config.previewText}
                                previewSize={config.cardPreviewSize}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
