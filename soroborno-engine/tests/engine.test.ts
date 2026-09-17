import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { normalizeFontId, discoverFonts } from '../engine/discovery/index.js';
import { validateFontBinaryHeader } from '../engine/validation/index.js';
import { generateVariantFontFace, generateFontCss } from '../engine/css/index.js';
import { buildFontMetadata } from '../engine/metadata/index.js';
import type { FontMetadata, FontVariant } from '../engine/types.js';

describe('Discovery & Normalization', () => {
  it('normalizes font folder names into kebab-case IDs', () => {
    expect(normalizeFontId('Bornomala Vintage')).toBe('bornomala-vintage');
    expect(normalizeFontId('Google_Sans')).toBe('google-sans');
    expect(normalizeFontId('solaiman-lipi')).toBe('solaiman-lipi');
    expect(normalizeFontId('Kohinoor Bangla')).toBe('kohinoor-bangla');
    expect(normalizeFontId('FN Masud Chowa')).toBe('fn-masud-chowa');
  });

  it('discovers fonts from font directory', () => {
    const fontsDir = path.resolve(__dirname, '../../../fonts');
    if (fs.existsSync(fontsDir)) {
      const discovered = discoverFonts(fontsDir);
      expect(discovered.length).toBeGreaterThan(0);
      const solaiman = discovered.find(d => d.id === 'solaiman-lipi');
      expect(solaiman).toBeDefined();
      expect(solaiman?.fontFilePaths.length).toBeGreaterThan(0);
    }
  });
});

describe('Validation', () => {
  it('identifies real font binary headers', () => {
    const sampleTtf = path.resolve(__dirname, '../../../fonts/Bornomala/Bornomala-Regular.ttf');
    if (fs.existsSync(sampleTtf)) {
      const res = validateFontBinaryHeader(sampleTtf);
      expect(res.valid).toBe(true);
      expect(res.format).toBe('truetype');
    }
  });

  it('rejects invalid or corrupted binaries', () => {
    // Test on package.json which is not a font
    const pkgJson = path.resolve(__dirname, '../package.json');
    const res = validateFontBinaryHeader(pkgJson);
    expect(res.valid).toBe(false);
  });
});

describe('CSS Generation', () => {
  it('generates standard @font-face rules with WOFF2 and TTF', () => {
    const variant: FontVariant = {
      weight: 400,
      style: 'normal',
      originalFileName: 'SolaimanLipi-Regular.ttf',
      files: {
        woff2: 'solaiman-lipi-400-normal.woff2',
        ttf: 'SolaimanLipi-Regular.ttf'
      }
    };

    const css = generateVariantFontFace('SolaimanLipi', variant);
    expect(css).toContain("font-family: 'SolaimanLipi';");
    expect(css).toContain('font-weight: 400;');
    expect(css).toContain('font-style: normal;');
    expect(css).toContain("url('./solaiman-lipi-400-normal.woff2') format('woff2')");
    expect(css).toContain("url('./SolaimanLipi-Regular.ttf') format('truetype')");
  });

  it('supports custom CDN base URL', () => {
    const variant: FontVariant = {
      weight: 700,
      style: 'normal',
      originalFileName: 'SolaimanLipi-Bold.ttf',
      files: {
        woff2: 'solaiman-lipi-700-normal.woff2'
      }
    };

    const css = generateVariantFontFace('SolaimanLipi', variant, {
      baseUrl: 'https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts/solaiman-lipi'
    });
    expect(css).toContain('https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts/solaiman-lipi/solaiman-lipi-700-normal.woff2');
  });

  it('generates utility class when requested', () => {
    const metadata: FontMetadata = {
      id: 'solaiman-lipi',
      family: 'SolaimanLipi',
      displayName: 'SolaimanLipi',
      description: 'Clean Bengali sans-serif',
      category: 'sans-serif',
      designer: 'Solaiman Karim',
      version: '2.0',
      license: { name: 'SIL OFL 1.1' },
      subsets: ['bengali'],
      weights: [400],
      styles: ['normal'],
      variants: [
        {
          weight: 400,
          style: 'normal',
          originalFileName: 'SolaimanLipi-Regular.ttf',
          files: { ttf: 'SolaimanLipi-Regular.ttf' }
        }
      ]
    };

    const css = generateFontCss(metadata, { includeUtilityClass: true });
    expect(css).toContain('.font-solaiman-lipi');
    expect(css).toContain('--font-solaiman-lipi:');
  });
});
