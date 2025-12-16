'use client';

import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';

interface Font {
    path: string;
    fileName: string;
    cdnUrl: string;
    format: string;
    familyName: string;
    weight: number;
    style: string;
    size: number;
}

interface FontCardProps {
    font: Font;
}

export function FontCard({ font }: FontCardProps) {
    const [copied, setCopied] = useState(false);

    const cssCode = `@font-face {
  font-family: '${font.familyName}';
  src: url('${font.cdnUrl}') format('${font.format === 'woff2' ? 'woff2' : font.format === 'woff' ? 'woff' : font.format === 'ttf' ? 'truetype' : 'opentype'}');
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: swap;
}`;

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const weightName = (weight: number) => {
        const names: Record<number, string> = {
            100: 'Thin', 200: 'Extra Light', 300: 'Light', 400: 'Regular',
            500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold', 900: 'Black',
        };
        return names[weight] || weight.toString();
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-lg transition-all group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {font.familyName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {weightName(font.weight)} {font.style !== 'normal' && `• ${font.style}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-medium text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                        {font.format.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">{formatSize(font.size)}</span>
                </div>
            </div>

            {/* Preview */}
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
              @font-face {
                font-family: 'Preview-${font.fileName.replace(/[^a-zA-Z0-9]/g, '')}';
                src: url('${font.cdnUrl}');
                font-weight: ${font.weight};
                font-style: ${font.style};
              }
            `,
                    }}
                />
                <p
                    className="text-2xl text-slate-800 dark:text-slate-200 mb-1"
                    style={{ fontFamily: `'Preview-${font.fileName.replace(/[^a-zA-Z0-9]/g, '')}', sans-serif` }}
                >
                    The quick brown fox jumps
                </p>
                <p
                    className="text-sm text-slate-500 dark:text-slate-400"
                    style={{ fontFamily: `'Preview-${font.fileName.replace(/[^a-zA-Z0-9]/g, '')}', sans-serif` }}
                >
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                </p>
            </div>

            {/* Code */}
            <div className="code-block p-3 mb-4 relative">
                <pre className="text-xs text-slate-600 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap">
                    {cssCode}
                </pre>
                <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition-colors"
                    title="Copy CSS"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy CSS'}
                </button>
                <a
                    href={font.cdnUrl}
                    download
                    className="flex items-center justify-center px-4 py-2.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    title="Download font"
                >
                    <Download className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
