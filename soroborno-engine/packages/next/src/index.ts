import { getFontStylesheetUrl, getFont } from '@shoroborno/core';

export interface NextFontOptions {
  weight?: string | number | (string | number)[];
  style?: 'normal' | 'italic' | ('normal' | 'italic')[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  variable?: string;
  fallback?: string[];
  preload?: boolean;
  cdnBaseUrl?: string;
}

export interface NextFontResult {
  className: string;
  variable: string;
  style: {
    fontFamily: string;
  };
}

let styleSheetInjected = false;

/**
 * Creates a Next.js font loader instance for a given font ID
 */
export function sorobornoFont(
  fontId: string,
  options: NextFontOptions = {}
): NextFontResult {
  const font = getFont(fontId);
  const family = font?.family || fontId;
  const variable = options.variable || `--font-${fontId}`;
  const className = `__font_${fontId.replace(/[^a-zA-Z0-9]/g, '_')}`;

  const fallbackArray = options.fallback || ['sans-serif'];
  const fullFontFamily = `'${family}', ${fallbackArray.join(', ')}`;

  // On client, ensure stylesheet is linked
  if (typeof window !== 'undefined') {
    const linkId = `soroborno-next-${fontId}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = getFontStylesheetUrl(fontId, options.cdnBaseUrl);
      document.head.appendChild(link);
    }
  }

  return {
    className,
    variable,
    style: {
      fontFamily: fullFontFamily
    }
  };
}

/**
 * Predefined helper loaders for popular Bangla fonts
 */
export const SolaimanLipi = (options?: NextFontOptions) => sorobornoFont('solaiman-lipi', options);
export const Kalpurush = (options?: NextFontOptions) => sorobornoFont('kalpurush', options);
export const Bornomala = (options?: NextFontOptions) => sorobornoFont('bornomala', options);
export const SiyamRupali = (options?: NextFontOptions) => sorobornoFont('siyam-rupali', options);
export const AdorshoLipi = (options?: NextFontOptions) => sorobornoFont('adorsho-lipi', options);
export const TiroBangla = (options?: NextFontOptions) => sorobornoFont('tiro-bangla', options);
export const NotoSerifBengali = (options?: NextFontOptions) => sorobornoFont('noto-serif-bengali', options);
export const GoogleSans = (options?: NextFontOptions) => sorobornoFont('google-sans', options);
export const Shurjo = (options?: NextFontOptions) => sorobornoFont('shurjo', options);
export const Boshonto = (options?: NextFontOptions) => sorobornoFont('boshonto', options);
export const Chilekotha = (options?: NextFontOptions) => sorobornoFont('chilekotha', options);
