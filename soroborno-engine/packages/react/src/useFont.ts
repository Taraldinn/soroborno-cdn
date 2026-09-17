import { useState, useEffect, type CSSProperties } from 'react';
import {
  type FontMetadata,
  type FontWeight,
  type FontStyle,
  getFont,
  getFontStylesheetUrl,
  getFontCss
} from '@shoroborno/core';

export interface UseFontOptions {
  weights?: (FontWeight | number)[];
  styles?: FontStyle[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  cdnBaseUrl?: string;
  strategy?: 'stylesheet' | 'inline';
}

export interface UseFontResult {
  className: string;
  style: CSSProperties;
  loaded: boolean;
  family: string;
  error?: Error;
}

const loadedStylesheets = new Set<string>();

/**
 * React hook to effortlessly load and use Soroborno Bangla fonts
 *
 * @example
 * ```tsx
 * import { useFont } from '@shoroborno/react';
 *
 * export function Title() {
 *   const font = useFont('solaiman-lipi');
 *   return <h1 className={font.className}>আমার সোনার বাংলা</h1>;
 * }
 * ```
 */
export function useFont(
  fontIdOrMetadata: string | FontMetadata,
  options: UseFontOptions = {}
): UseFontResult {
  const font = typeof fontIdOrMetadata === 'string'
    ? getFont(fontIdOrMetadata)
    : fontIdOrMetadata;

  const fontId = typeof fontIdOrMetadata === 'string' ? fontIdOrMetadata : fontIdOrMetadata.id;
  const family = font?.family || fontId;
  const className = `font-${fontId}`;
  const fallback = font?.category === 'serif' ? 'serif' : font?.category === 'monospace' ? 'monospace' : 'sans-serif';

  const [loaded, setLoaded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return loadedStylesheets.has(fontId);
  });
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (loadedStylesheets.has(fontId)) {
      setLoaded(true);
      return;
    }

    try {
      const linkId = `soroborno-font-${fontId}`;
      let existingLink = document.getElementById(linkId) as HTMLLinkElement | null;

      if (!existingLink) {
        existingLink = document.createElement('link');
        existingLink.id = linkId;
        existingLink.rel = 'stylesheet';
        existingLink.href = getFontStylesheetUrl(fontId, options.cdnBaseUrl);

        existingLink.onload = () => {
          loadedStylesheets.add(fontId);
          setLoaded(true);
        };

        existingLink.onerror = (e) => {
          const err = new Error(`Failed to load stylesheet for font '${fontId}'`);
          setError(err);
        };

        document.head.appendChild(existingLink);
      } else {
        loadedStylesheets.add(fontId);
        setLoaded(true);
      }
    } catch (err: any) {
      setError(err);
    }
  }, [fontId, options.cdnBaseUrl]);

  return {
    className,
    style: {
      fontFamily: `'${family}', ${fallback}`
    },
    loaded,
    family,
    error
  };
}
