import {
  type FontMetadata,
  type GetFontCssOptions,
  getFontCss as coreGetFontCss,
  getFontStylesheetUrl
} from '@soroborno/core';

export { getFontStylesheetUrl };

/**
 * Generates an HTML <link> tag to load a font stylesheet
 */
export function createHtmlLinkTag(fontId: string, customCdn?: string): string {
  const url = getFontStylesheetUrl(fontId, customCdn);
  return `<link rel="stylesheet" href="${url}">`;
}

/**
 * Generates a CSS @import rule to load a font stylesheet
 */
export function createCssImportRule(fontId: string, customCdn?: string): string {
  const url = getFontStylesheetUrl(fontId, customCdn);
  return `@import url('${url}');`;
}

/**
 * Returns a CSS font-family declaration string
 */
export function createFontFamilyRule(family: string, fallback: 'sans-serif' | 'serif' | 'monospace' = 'sans-serif'): string {
  return `font-family: '${family}', ${fallback};`;
}

/**
 * Generates complete @font-face CSS
 */
export function generateCss(font: FontMetadata, options?: GetFontCssOptions): string {
  return coreGetFontCss(font, options);
}
