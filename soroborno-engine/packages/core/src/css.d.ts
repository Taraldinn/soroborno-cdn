import type { FontMetadata, GetFontCssOptions, FontVariant } from './types.js';
/**
 * Generates an @font-face CSS rule for a specific variant
 */
export declare function generateVariantCss(family: string, variant: FontVariant, fontId: string, options?: GetFontCssOptions): string;
/**
 * Generates complete CSS declarations for a font
 */
export declare function getFontCss(font: FontMetadata, options?: GetFontCssOptions): string;
//# sourceMappingURL=css.d.ts.map