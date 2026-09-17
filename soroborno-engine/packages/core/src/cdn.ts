import type { FontMetadata, GetFontUrlOptions } from './types.js';

export const DEFAULT_CDN_BASE = 'https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts';

/**
 * Resolves a full CDN URL for a font file
 */
export function resolveCdnUrl(fontId: string, fileName: string, customCdn?: string): string {
  const base = (customCdn || DEFAULT_CDN_BASE).replace(/\/$/, '');
  return `${base}/${fontId}/${fileName}`;
}

/**
 * Generates the full CDN URL for a specific font weight, style, and format
 */
export function getFontUrl(
  font: FontMetadata,
  options: GetFontUrlOptions = {}
): string {
  const targetWeight = options.weight || 400;
  const targetStyle = options.style || 'normal';
  const targetFormat = options.format || 'woff2';

  // Find exact variant or closest variant
  let variant = font.variants.find(
    v => v.weight === targetWeight && v.style === targetStyle
  );

  if (!variant) {
    variant = font.variants.find(v => v.weight === targetWeight) || font.variants[0];
  }

  if (!variant) {
    throw new Error(`No font variants found for font '${font.id}'`);
  }

  let fileName = variant.files[targetFormat];
  if (!fileName) {
    // Fall back to woff2 -> ttf -> otf
    fileName = variant.files.woff2 || variant.files.ttf || variant.files.otf || variant.originalFileName;
  }

  return resolveCdnUrl(font.id, fileName, options.cdnBaseUrl);
}

/**
 * Returns the CDN URL for the prebuilt CSS stylesheet of a font
 */
export function getFontStylesheetUrl(fontId: string, customCdn?: string): string {
  return resolveCdnUrl(fontId, 'font.css', customCdn);
}
