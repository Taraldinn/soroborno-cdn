import type { FontMetadata, GetFontCssOptions, FontVariant } from './types.js';
import { resolveCdnUrl } from './cdn.js';

/**
 * Generates an @font-face CSS rule for a specific variant
 */
export function generateVariantCss(
  family: string,
  variant: FontVariant,
  fontId: string,
  options: GetFontCssOptions = {}
): string {
  const display = options.display || 'swap';
  const srcParts: string[] = [];

  if (variant.files.woff2) {
    const url = resolveCdnUrl(fontId, variant.files.woff2, options.cdnBaseUrl);
    srcParts.push(`url('${url}') format('woff2')`);
  }
  if (variant.files.woff) {
    const url = resolveCdnUrl(fontId, variant.files.woff, options.cdnBaseUrl);
    srcParts.push(`url('${url}') format('woff')`);
  }
  if (variant.files.ttf) {
    const url = resolveCdnUrl(fontId, variant.files.ttf, options.cdnBaseUrl);
    srcParts.push(`url('${url}') format('truetype')`);
  }
  if (variant.files.otf) {
    const url = resolveCdnUrl(fontId, variant.files.otf, options.cdnBaseUrl);
    srcParts.push(`url('${url}') format('opentype')`);
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
 * Generates complete CSS declarations for a font
 */
export function getFontCss(
  font: FontMetadata,
  options: GetFontCssOptions = {}
): string {
  const chunks: string[] = [
    `/* Soroborno Font: ${font.displayName} (${font.id}) */`,
    `/* License: ${font.license.name} */\n`
  ];

  let variants = font.variants;
  if (options.weights && options.weights.length > 0) {
    variants = variants.filter(v => options.weights!.map(Number).includes(v.weight));
  }
  if (options.styles && options.styles.length > 0) {
    variants = variants.filter(v => options.styles!.includes(v.style));
  }

  for (const variant of variants) {
    chunks.push(generateVariantCss(font.family, variant, font.id, options));
  }

  if (options.includeUtilityClass) {
    const fallback = font.category === 'serif' ? 'serif' : font.category === 'monospace' ? 'monospace' : 'sans-serif';
    chunks.push(`
.font-${font.id} {
  font-family: '${font.family}', ${fallback};
}

:root {
  --font-${font.id}: '${font.family}', ${fallback};
}`);
  }

  return chunks.join('\n\n') + '\n';
}
