'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
    ToggleLeft, ToggleRight, Keyboard, FileDown, FileText,
    Code, ChevronDown, Loader2, RefreshCw, Type
} from 'lucide-react';
import { AvroPhonetic } from '@/utils/avro';
import fontsData from '@/data/fonts.json';
import dynamic from 'next/dynamic';

// Dynamically import Milkdown with no SSR
const MilkdownEditor = dynamic(
    () => import('./MilkdownWrapper'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full bg-white dark:bg-slate-900 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading editor...
            </div>
        )
    }
);

// Bangla Unicode to ANSI mapping (Bijoy)
const unicodeToAnsiMap: Record<string, string> = {
    'অ': 'A', 'আ': 'Av', 'ই': 'B', 'ঈ': 'C', 'উ': 'D', 'ঊ': 'E', 'ঋ': 'F',
    'এ': 'G', 'ঐ': 'H', 'ও': 'I', 'ঔ': 'J',
    'ক': 'K', 'খ': 'L', 'গ': 'M', 'ঘ': 'N', 'ঙ': 'O',
    'চ': 'P', 'ছ': 'Q', 'জ': 'R', 'ঝ': 'S', 'ঞ': 'T',
    'ট': 'U', 'ঠ': 'V', 'ড': 'W', 'ঢ': 'X', 'ণ': 'Y',
    'ত': 'Z', 'থ': '_', 'দ': '`', 'ধ': 'a', 'ন': 'b',
    'প': 'c', 'ফ': 'd', 'ব': 'e', 'ভ': 'f', 'ম': 'g',
    'য': 'h', 'র': 'i', 'ল': 'j', 'শ': 'k', 'ষ': 'l',
    'স': 'm', 'হ': 'n', 'ড়': 'o', 'ঢ়': 'p', 'য়': 'q',
    'ৎ': 'r', 'ং': 's', 'ঃ': 't', 'ঁ': 'u',
    'া': 'v', 'ি': 'w', 'ী': 'x', 'ু': 'y', 'ূ': 'z',
    'ৃ': '{', 'ে': '|', 'ৈ': '}', 'ো': '~', 'ৌ': '',
    '্': '&zwj;',
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};

function convertUnicodeToAnsi(text: string): string {
    let result = '';
    for (const char of text) {
        result += unicodeToAnsiMap[char] || char;
    }
    return result;
}

function markdownToHtml(md: string): string {
    let html = md
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\- (.*$)/gm, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
        .replace(/\n/g, '<br>');
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title></head><body>${html}</body></html>`;
}

interface FontInfo {
    slug: string;
    name: string;
    cssUrl: string;
}

export default function PlaygroundEditor() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    const [mode, setMode] = useState<'visual' | 'source' | 'avro'>('source');
    const [markdown, setMarkdown] = useState(`# স্বাগতম!

এটি একটি **Markdown Editor**।

## বৈশিষ্ট্যসমূহ
- **Visual Mode**: Rich text editing
- **Source Mode**: Raw markdown
- **Avro Mode**: ইংরেজি → বাংলা

**Try it out!**
`);

    const [avroEnabled, setAvroEnabled] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [selectedFont, setSelectedFont] = useState('');
    const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fonts: FontInfo[] = (fontsData as FontInfo[]).map(f => ({
        slug: f.slug,
        name: f.name,
        cssUrl: f.cssUrl
    }));

    const loadFont = useCallback((cssUrl: string) => {
        if (!isMounted || loadedFonts.has(cssUrl)) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
        setLoadedFonts(prev => new Set([...prev, cssUrl]));
    }, [loadedFonts, isMounted]);

    useEffect(() => {
        if (isMounted && selectedFont) {
            const font = fonts.find(f => f.name === selectedFont);
            if (font) loadFont(font.cssUrl);
        }
    }, [selectedFont, fonts, loadFont, isMounted]);

    useEffect(() => {
        if (!isMounted || !avroEnabled || !currentWord) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await AvroPhonetic.fetchSuggestions(currentWord);
                setSuggestions(results.slice(0, 5));
                setShowSuggestions(results.length > 0);
            } catch (e) {
                console.error('Suggestion error:', e);
            } finally {
                setIsLoading(false);
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [currentWord, avroEnabled, isMounted]);

    const handleTextareaInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;
        setMarkdown(value);

        if (!avroEnabled) {
            setCurrentWord('');
            setShowSuggestions(false);
            return;
        }

        const textBeforeCursor = value.slice(0, cursorPos);
        const match = textBeforeCursor.match(/([a-zA-Z]+)$/);
        setCurrentWord(match ? match[1] : '');
        if (!match) setShowSuggestions(false);
    }, [avroEnabled]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!avroEnabled) return;

        if (showSuggestions && suggestions.length > 0) {
            if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                selectSuggestion(suggestions[0]);
                return;
            }
            if (e.key === 'Escape') {
                setShowSuggestions(false);
                return;
            }
        }

        if (e.key === ' ' && currentWord && suggestions.length > 0) {
            e.preventDefault();
            selectSuggestion(suggestions[0], ' ');
        }
    }, [avroEnabled, showSuggestions, suggestions, currentWord]);

    const selectSuggestion = useCallback((suggestion: string, suffix = '') => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const cursorPos = textarea.selectionStart;
        const value = markdown;

        const textBeforeCursor = value.slice(0, cursorPos);
        const match = textBeforeCursor.match(/([a-zA-Z]+)$/);

        if (match) {
            const wordStart = cursorPos - match[1].length;
            const newValue = value.slice(0, wordStart) + suggestion + suffix + value.slice(cursorPos);
            setMarkdown(newValue);

            setTimeout(() => {
                const newPos = wordStart + suggestion.length + suffix.length;
                textarea.selectionStart = newPos;
                textarea.selectionEnd = newPos;
                textarea.focus();
            }, 0);
        }

        setCurrentWord('');
        setSuggestions([]);
        setShowSuggestions(false);
    }, [markdown]);

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
    };

    const exportAsMarkdown = () => downloadBlob(new Blob([markdown], { type: 'text/markdown' }), 'document.md');
    const exportAsText = () => downloadBlob(new Blob([markdown], { type: 'text/plain' }), 'document.txt');
    const exportAsHtml = () => downloadBlob(new Blob([markdownToHtml(markdown)], { type: 'text/html' }), 'document.html');
    const exportAsRtf = () => {
        const rtf = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 ${markdown.replace(/\n/g, '\\par ')}}`;
        downloadBlob(new Blob([rtf], { type: 'application/rtf' }), 'document.rtf');
    };
    const exportAsAnsi = () => downloadBlob(new Blob([convertUnicodeToAnsi(markdown)], { type: 'text/plain' }), 'document-bijoy.txt');

    if (!isMounted) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[80vh]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 dark:bg-sky-900/50 rounded-lg text-sky-600 dark:text-sky-400">
                            <Keyboard className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-slate-800 dark:text-white hidden sm:block">Editor</h2>
                    </div>

                    {/* Mode Selector */}
                    <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                        <button
                            onClick={() => setMode('visual')}
                            className={`px-3 py-1.5 text-sm font-medium ${mode === 'visual' ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                        >
                            Visual
                        </button>
                        <button
                            onClick={() => setMode('source')}
                            className={`px-3 py-1.5 text-sm font-medium ${mode === 'source' ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                        >
                            Source
                        </button>
                    </div>

                    {/* Avro Toggle */}
                    <button
                        onClick={() => setAvroEnabled(!avroEnabled)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${avroEnabled
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                    >
                        <span className="text-sm font-bold">বাংলা</span>
                        {avroEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>

                    {/* Font Selector */}
                    <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <select
                            value={selectedFont}
                            onChange={(e) => setSelectedFont(e.target.value)}
                            className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm max-w-[140px]"
                        >
                            <option value="">Default</option>
                            {fonts.map(font => (
                                <option key={font.slug} value={font.name}>{font.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin text-sky-500" />}

                    {/* Export Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                        >
                            <FileDown className="w-4 h-4" />
                            <span className="text-sm hidden sm:inline">Export</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                                <button onClick={exportAsMarkdown} className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-800 dark:text-white">
                                    <Code className="w-4 h-4" /> Markdown (.md)
                                </button>
                                <button onClick={exportAsText} className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-800 dark:text-white">
                                    <FileText className="w-4 h-4" /> Plain Text (.txt)
                                </button>
                                <button onClick={exportAsHtml} className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-800 dark:text-white">
                                    <Code className="w-4 h-4" /> HTML (.html)
                                </button>
                                <button onClick={exportAsRtf} className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-800 dark:text-white">
                                    <FileText className="w-4 h-4" /> Word (.rtf)
                                </button>
                                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                                <button onClick={exportAsAnsi} className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-800 dark:text-white">
                                    <RefreshCw className="w-4 h-4" /> Bijoy ANSI
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Avro Status */}
            {avroEnabled && (
                <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 border-b border-emerald-200 dark:border-emerald-800">
                    <span className="text-emerald-800 dark:text-emerald-300 text-sm">
                        🔤 Avro সক্রিয় - ইংরেজিতে টাইপ করুন, Space চাপুন!
                    </span>
                </div>
            )}

            {/* Editor */}
            <div className="flex-1 relative overflow-hidden">
                {mode === 'visual' ? (
                    <MilkdownEditor
                        markdown={markdown}
                        onChange={setMarkdown}
                        selectedFont={selectedFont}
                        avroEnabled={avroEnabled}
                    />
                ) : (
                    <div className="relative h-full">
                        <textarea
                            ref={textareaRef}
                            value={markdown}
                            onChange={handleTextareaInput}
                            onKeyDown={handleKeyDown}
                            className="w-full h-full p-6 resize-none outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-lg leading-relaxed"
                            style={{ fontFamily: avroEnabled ? (selectedFont || 'inherit') : 'ui-monospace, monospace' }}
                            placeholder={avroEnabled ? 'ইংরেজিতে টাইপ করুন...' : 'Write markdown...'}
                        />

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-16 left-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                                <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 border-b">
                                    {currentWord} →
                                </div>
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => selectSuggestion(s)}
                                        className={`w-full px-4 py-2 text-left hover:bg-sky-100 dark:hover:bg-sky-900/30 text-slate-900 dark:text-white ${i === 0 ? 'bg-sky-50 dark:bg-sky-900/20' : ''}`}
                                    >
                                        {s}
                                        {i === 0 && <span className="ml-2 text-xs text-slate-400">(Space)</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{markdown.length} chars</span>
                <span>{markdown.split(/\s+/).filter(w => w).length} words</span>
            </div>
        </div>
    );
}
