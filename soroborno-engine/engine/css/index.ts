import type { FontMetadata, FontVariant } from '../types.js';

export interface GenerateCssOptions {
  /**
   * Base URL for font files (e.g. CDN path or empty for relative)
   */
  baseUrl?: string;
  /**
   * Font display strategy (default: 'swap')
   */
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  /**
   * Specific weights to include. If omitted, all variants are included.
   */
  weights?: number[];
  /**
   * Specific styles to include. If omitted, all styles are included.
   */
  styles?: string[];
  /**
   * Whether to include utility CSS class (e.g. .font-solaiman-lipi)
   */
  includeUtilityClass?: boolean;
}

/**
 * Generates a single @font-face CSS rule for a variant
 */
export function generateVariantFontFace(
  family: string,
  variant: FontVariant,
  options: GenerateCssOptions = {}
): string {
  const display = options.fontDisplay || 'swap';
  const baseUrl = options.baseUrl ? options.baseUrl.replace(/\/$/, '') + '/' : './';

  const srcParts: string[] = [];

  // WOFF2 takes precedence
  if (variant.files.woff2) {
    srcParts.push(`url('${baseUrl}${variant.files.woff2}') format('woff2')`);
  }
  // WOFF legacy fallback
  if (variant.files.woff) {
    srcParts.push(`url('${baseUrl}${variant.files.woff}') format('woff')`);
  }
  // TTF fallback
  if (variant.files.ttf) {
    srcParts.push(`url('${baseUrl}${variant.files.ttf}') format('truetype')`);
  }
  // OTF fallback
  if (variant.files.otf) {
    srcParts.push(`url('${baseUrl}${variant.files.otf}') format('opentype')`);
  }

  if (srcParts.length === 0 && variant.originalFileName) {
    const ext = variant.originalFileName.split('.').pop()?.toLowerCase();
    const format = ext === 'otf' ? 'opentype' : 'truetype';
    srcParts.push(`url('${baseUrl}${variant.originalFileName}') format('${format}')`);
  }

  return `@font-face {
  font-family: '${family}';
  font-style: ${variant.style};
  font-weight: ${variant.weight};
  font-display: ${display};
  src: ${srcParts.join(',\n       ')};
}`;
}

/**
 * Generates complete CSS declarations for a font family
 */
export function generateFontCss(
  metadata: FontMetadata,
  options: GenerateCssOptions = {}
): string {
  const chunks: string[] = [
    `/* Soroborno Font: ${metadata.displayName} (${metadata.id}) */`,
    `/* License: ${metadata.license.name} */\n`
  ];

  let variants = metadata.variants;
  if (options.weights && options.weights.length > 0) {
    variants = variants.filter(v => options.weights!.includes(v.weight));
  }
  if (options.styles && options.styles.length > 0) {
    variants = variants.filter(v => options.styles!.includes(v.style));
  }

  for (const variant of variants) {
    chunks.push(generateVariantFontFace(metadata.family, variant, options));
  }

  if (options.includeUtilityClass) {
    const fallbackCategory = metadata.category === 'serif' ? 'serif' : metadata.category === 'monospace' ? 'monospace' : 'sans-serif';
    chunks.push(`
.font-${metadata.id} {
  font-family: '${metadata.family}', ${fallbackCategory};
}

:root {
  --font-${metadata.id}: '${metadata.family}', ${fallbackCategory};
}`);
  }

  return chunks.join('\n\n') + '\n';
}
