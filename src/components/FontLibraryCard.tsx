'use client';

import { useState } from 'react';
import { Check, Copy, Code, Link2, Download } from 'lucide-react';

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

interface FontLibraryCardProps {
    font: FontInfo;
    previewText: string;
    previewSize: number;
}

export function FontLibraryCard({ font, previewText, previewSize }: FontLibraryCardProps) {
    const [copied, setCopied] = useState<string | null>(null);
    const [selectedWeight, setSelectedWeight] = useState(font.weights[Math.floor(font.weights.length / 2)] || '400');

    // Use jsDelivr CDN for external links
    const CDN_BASE = 'https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public';
    const cdnUrl = `${CDN_BASE}/fonts/${font.slug}/font.css`;

    const cssImport = `@import url('${cdnUrl}');`;
    const htmlLink = `<link href="${cdnUrl}" rel="stylesheet">`;
    const cssRule = `font-family: '${font.name}', sans-serif;`;

    const copyText = async (text: string, type: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const weightName = (weight: string) => {
        const names: Record<string, string> = {
            '100': 'Thin', '200': 'Extra Light', '300': 'Light', '400': 'Regular',
            '500': 'Medium', '600': 'Semi Bold', '700': 'Bold', '800': 'Extra Bold', '900': 'Black',
        };
        return names[weight] || weight;
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-xl transition-all group">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {font.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            ডিজাইনার: {font.designer}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            {font.license}
                        </span>
                    </div>
                </div>

                {/* Weight selector */}
                {font.weights.length > 1 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {font.weights.map(weight => (
                            <button
                                key={weight}
                                onClick={() => setSelectedWeight(weight)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${selectedWeight === weight
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {weightName(weight)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                <link rel="stylesheet" href={font.cssUrl} />
                <p
                    className="text-slate-800 dark:text-slate-200 leading-relaxed break-words"
                    style={{
                        fontFamily: `'${font.name}', sans-serif`,
                        fontSize: `${previewSize}px`,
                        fontWeight: parseInt(selectedWeight),
                    }}
                >
                    {previewText || `যাঁরা স্বর্গগত তাঁরা এখনও জানেন
                                        স্বর্গের চেয়ে প্রিয় জন্মভূমি
                                        এসো স্বদেশ ব্রতের মহা দীক্ষা লভি
                                        সেই মৃত্যুঞ্জয়ীদের চরণ চুমি।।
                                            `}
                </p>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
                {/* Copy buttons */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => copyText(htmlLink, 'html')}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    >
                        {copied === 'html' ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                        {copied === 'html' ? 'কপি হয়েছে!' : 'লিংক'}
                    </button>

                    <button
                        onClick={() => copyText(cssImport, 'import')}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    >
                        {copied === 'import' ? <Check className="w-4 h-4 text-green-500" /> : <Code className="w-4 h-4" />}
                        {copied === 'import' ? 'কপি হয়েছে!' : '@ইম্পোর্ট'}
                    </button>

                    <button
                        onClick={() => copyText(cssRule, 'css')}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    >
                        {copied === 'css' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied === 'css' ? 'কপি হয়েছে!' : 'CSS রুল'}
                    </button>

                </div>

                <div className="flex gap-2">
                    <a
                        href={`/fonts/${font.slug}/${font.files[0]}`}
                        download
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        ডাউনলোড
                    </a>
                </div>
            </div>
        </div>
    );
}
