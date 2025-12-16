'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface FontConfig {
    fontFamily: string | null;
    cssUrl: string | null;
    fontSize: number; // in pixels, default 16
    isBold: boolean;
    isItalic: boolean;
    // Library Preview Settings
    previewText: string;
    cardPreviewSize: number;
}

const defaultConfig: FontConfig = {
    fontFamily: null,
    cssUrl: null,
    fontSize: 16,
    isBold: false,
    isItalic: false,
    previewText: '',
    cardPreviewSize: 32,
};

interface FontContextType {
    config: FontConfig;
    setConfig: (config: FontConfig) => void;
    updateConfig: (updates: Partial<FontConfig>) => void;
    resetConfig: () => void;
}

const FontContext = createContext<FontContextType>({
    config: defaultConfig,
    setConfig: () => { },
    updateConfig: () => { },
    resetConfig: () => { },
});

export function FontProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfigState] = useState<FontConfig>(defaultConfig);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('soroborno-ui-config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setConfigState({ ...defaultConfig, ...parsed });
            } catch (e) {
                console.error('Failed to parse saved config', e);
            }
        }
        setMounted(true);
    }, []);

    const setConfig = (newConfig: FontConfig) => {
        setConfigState(newConfig);
        localStorage.setItem('soroborno-ui-config', JSON.stringify(newConfig));
    };

    const updateConfig = (updates: Partial<FontConfig>) => {
        setConfig({ ...config, ...updates });
    };

    const resetConfig = () => {
        setConfig(defaultConfig);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <FontContext.Provider value={{ config, setConfig, updateConfig, resetConfig }}>
            {config.cssUrl && <link rel="stylesheet" href={config.cssUrl} />}
            <style jsx global>{`
        :root {
          --font-ui: ${config.fontFamily ? `'${config.fontFamily}', sans-serif` : 'var(--font-family-sans)'};
          font-size: ${config.fontSize}px;
        }
        body {
          font-family: var(--font-ui) !important;
          font-weight: ${config.isBold ? '700' : '400'} !important;
          font-style: ${config.isItalic ? 'italic' : 'normal'} !important;
        }
      `}</style>
            {children}
        </FontContext.Provider>
    );
}

export const useFont = () => useContext(FontContext);
