'use client';

import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AvroPhonetic } from '@/utils/avro';

interface MilkdownEditorProps {
    markdown: string;
    onChange: (value: string) => void;
    selectedFont?: string;
    avroEnabled?: boolean;
}

export default function MilkdownWrapper({ markdown, onChange, selectedFont, avroEnabled = false }: MilkdownEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);
    const initialMarkdown = useRef(markdown);
    const onChangeRef = useRef(onChange);
    const avroEnabledRef = useRef(avroEnabled);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentWord, setCurrentWord] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [suggestionPosition, setSuggestionPosition] = useState({ x: 100, y: 100 });

    const suggestionsRef = useRef<string[]>([]);
    const showSuggestionsRef = useRef(false);
    const selectedIndexRef = useRef(0);
    const currentWordRef = useRef('');

    // Keep refs updated
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        avroEnabledRef.current = avroEnabled;
        if (!avroEnabled) {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    }, [avroEnabled]);

    useEffect(() => {
        suggestionsRef.current = suggestions;
    }, [suggestions]);

    useEffect(() => {
        showSuggestionsRef.current = showSuggestions;
    }, [showSuggestions]);

    useEffect(() => {
        selectedIndexRef.current = selectedIndex;
    }, [selectedIndex]);

    useEffect(() => {
        currentWordRef.current = currentWord;
    }, [currentWord]);

    const replaceWord = useCallback((suggestion: string, suffix: string = ' ') => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return false;

        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            const text = node.textContent;
            const cursorPosition = range.startOffset;
            const textBeforeCursor = text.slice(0, cursorPosition);

            const match = textBeforeCursor.match(/([a-zA-Z]+)$/);

            if (match) {
                const wordStart = cursorPosition - match[1].length;
                const newText = text.slice(0, wordStart) + suggestion + suffix + text.slice(cursorPosition);

                node.textContent = newText;

                // Restore cursor
                try {
                    const newCursorPos = wordStart + suggestion.length + suffix.length;
                    range.setStart(node, Math.min(newCursorPos, newText.length));
                    range.setEnd(node, Math.min(newCursorPos, newText.length));
                    selection.removeAllRanges();
                    selection.addRange(range);
                } catch (err) {
                    console.error('Cursor restore error:', err);
                }

                return true;
            }
        }
        return false;
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const crepe = new Crepe({
            root: containerRef.current,
            defaultValue: initialMarkdown.current,
            features: {
                [Crepe.Feature.Toolbar]: true,
                [Crepe.Feature.LinkTooltip]: true,
                [Crepe.Feature.ImageBlock]: true,
                [Crepe.Feature.BlockEdit]: true,
                [Crepe.Feature.Placeholder]: true,
                [Crepe.Feature.CodeMirror]: true,
                [Crepe.Feature.ListItem]: true,
                [Crepe.Feature.Table]: true,
            },
            featureConfigs: {
                [Crepe.Feature.Placeholder]: {
                    text: 'এখানে লিখুন...'
                }
            }
        });

        crepe.create().then(() => {
            crepeRef.current = crepe;
        });

        crepe.on((listener) => {
            listener.markdownUpdated((_, md) => {
                onChangeRef.current(md);
            });
        });

        // Debounced Avro detection
        let debounceTimer: NodeJS.Timeout;

        const handleInput = () => {
            if (!avroEnabledRef.current) return;

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;

                const range = selection.getRangeAt(0);
                const node = range.startContainer;

                if (node.nodeType === Node.TEXT_NODE && node.textContent) {
                    const text = node.textContent;
                    const cursorPosition = range.startOffset;
                    const textBeforeCursor = text.slice(0, cursorPosition);

                    const match = textBeforeCursor.match(/([a-zA-Z]+)$/);

                    if (match && match[1].length >= 2) {
                        const word = match[1];
                        setCurrentWord(word);

                        // Get cursor position for suggestion popup
                        const rect = range.getBoundingClientRect();
                        setSuggestionPosition({ x: Math.max(10, rect.left), y: rect.bottom + 5 });

                        try {
                            const results = await AvroPhonetic.fetchSuggestions(word);
                            if (results.length > 0 && results[0] !== word) {
                                setSuggestions(results.slice(0, 5));
                                setShowSuggestions(true);
                                setSelectedIndex(0);
                            } else {
                                setShowSuggestions(false);
                            }
                        } catch (e) {
                            setShowSuggestions(false);
                        }
                    } else {
                        setShowSuggestions(false);
                        setSuggestions([]);
                    }
                }
            }, 150);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!avroEnabledRef.current) return;

            const hasSuggestions = showSuggestionsRef.current && suggestionsRef.current.length > 0;

            if (!hasSuggestions) return;

            // Arrow key navigation
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                setSelectedIndex(prev => Math.min(prev + 1, suggestionsRef.current.length - 1));
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                return;
            }

            // Escape to close
            if (e.key === 'Escape') {
                e.preventDefault();
                setShowSuggestions(false);
                setSuggestions([]);
                return;
            }

            // Space, Tab, or Enter to select
            if (e.key === ' ' || e.key === 'Tab' || e.key === 'Enter') {
                const currentSuggestion = suggestionsRef.current[selectedIndexRef.current];
                if (currentSuggestion) {
                    e.preventDefault();
                    e.stopPropagation();

                    const suffix = e.key === 'Enter' ? '' : ' ';
                    const replaced = replaceWord(currentSuggestion, suffix);

                    if (replaced) {
                        setShowSuggestions(false);
                        setSuggestions([]);
                        setCurrentWord('');
                        setSelectedIndex(0);
                    }
                }
            }
        };

        const container = containerRef.current;
        container.addEventListener('input', handleInput, true);
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            clearTimeout(debounceTimer);
            container.removeEventListener('input', handleInput, true);
            document.removeEventListener('keydown', handleKeyDown, true);
            crepe.destroy();
        };
    }, [replaceWord]);

    const handleSuggestionClick = (suggestion: string, index: number) => {
        setSelectedIndex(index);
        const replaced = replaceWord(suggestion, ' ');
        if (replaced) {
            setShowSuggestions(false);
            setSuggestions([]);
            setCurrentWord('');
            setSelectedIndex(0);
        }
    };

    return (
        <div className="relative h-full">
            <div
                ref={containerRef}
                className="milkdown-crepe-container h-full overflow-auto bg-white dark:bg-slate-900"
                style={{
                    '--milkdown-font-family': selectedFont ? `'${selectedFont}', sans-serif` : 'inherit'
                } as React.CSSProperties}
            />

            {/* Avro Suggestions Popup */}
            {showSuggestions && suggestions.length > 0 && avroEnabled && (
                <div
                    className="fixed bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[9999] min-w-[180px]"
                    style={{ left: suggestionPosition.x, top: suggestionPosition.y }}
                >
                    <div className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">🔤</span>
                        <span>{currentWord}</span>
                        <span className="ml-auto text-xs opacity-80">↑↓ Space</span>
                    </div>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSuggestionClick(s, i)}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors ${i === selectedIndex
                                ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
                                : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <span className="text-lg">{s}</span>
                            {i === selectedIndex && (
                                <span className="text-xs px-1.5 py-0.5 bg-sky-500 text-white rounded">Enter</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
