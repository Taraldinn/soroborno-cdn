import type { FontMetadata, GetFontUrlOptions } from './types.js';
export declare const DEFAULT_CDN_BASE = "https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts";
/**
 * Resolves a full CDN URL for a font file
 */
export declare function resolveCdnUrl(fontId: string, fileName: string, customCdn?: string): string;
/**
 * Generates the full CDN URL for a specific font weight, style, and format
 */
export declare function getFontUrl(font: FontMetadata, options?: GetFontUrlOptions): string;
/**
 * Returns the CDN URL for the prebuilt CSS stylesheet of a font
 */
export declare function getFontStylesheetUrl(fontId: string, customCdn?: string): string;
//# sourceMappingURL=cdn.d.ts.map