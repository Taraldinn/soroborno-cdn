import { describe, it, expect } from 'vitest';
import { getFont, getFontUrl, getFontCss, listFonts, resolveCdnUrl } from '../packages/core/dist/index.js';
import { fonts, fontMap, solaimanLipi } from '../packages/fonts/dist/index.js';
import { createHtmlLinkTag, createCssImportRule, createFontFamilyRule } from '../packages/css/dist/index.js';
import { SolaimanLipi, sorobornoFont } from '../packages/next/dist/index.js';
import { sorobornoPlugin } from '../packages/vite/dist/index.js';
import { defineSorobornoNuxtModule } from '../packages/nuxt/dist/index.js';

describe('@shoroborno/core & @shoroborno/fonts', () => {
  it('has populated registry from @shoroborno/fonts', () => {
    expect(fonts.length).toBeGreaterThanOrEqual(30);
    expect(fontMap.has('solaiman-lipi')).toBe(true);
    expect(solaimanLipi).toBeDefined();
    expect(solaimanLipi.family).toBeDefined();
  });

  it('retrieves font by ID from core registry', () => {
    const font = getFont('solaiman-lipi');
    expect(font).toBeDefined();
    expect(font?.id).toBe('solaiman-lipi');
  });

  it('generates correct CDN URLs for WOFF2', () => {
    const font = getFont('solaiman-lipi');
    expect(font).toBeDefined();
    const url = getFontUrl(font!, { weight: 400, format: 'woff2' });
    expect(url).toContain('https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts/solaiman-lipi/');
    expect(url).toContain('.woff2');
  });

  it('generates correct CSS declarations', () => {
    const font = getFont('solaiman-lipi');
    expect(font).toBeDefined();
    const css = getFontCss(font!, { includeUtilityClass: true });
    expect(css).toContain('@font-face');
    expect(css).toContain('font-family:');
    expect(css).toContain('.font-solaiman-lipi');
  });

  it('lists fonts and filters by category', () => {
    const all = listFonts();
    expect(all.length).toBeGreaterThanOrEqual(30);
  });
});

describe('@shoroborno/css', () => {
  it('generates link tag', () => {
    const tag = createHtmlLinkTag('solaiman-lipi');
    expect(tag).toContain('<link rel="stylesheet"');
    expect(tag).toContain('/solaiman-lipi/font.css');
  });

  it('generates @import rule', () => {
    const rule = createCssImportRule('kalpurush');
    expect(rule).toContain("@import url('https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts/kalpurush/font.css');");
  });

  it('generates font-family rule', () => {
    const rule = createFontFamilyRule('SolaimanLipi', 'sans-serif');
    expect(rule).toBe("font-family: 'SolaimanLipi', sans-serif;");
  });
});

describe('@shoroborno/next', () => {
  it('generates variable and class name for Next.js', () => {
    const res = SolaimanLipi({ variable: '--font-solaiman' });
    expect(res.variable).toBe('--font-solaiman');
    expect(res.className).toBe('__font_solaiman_lipi');
    expect(res.style.fontFamily).toContain('sans-serif');
  });

  it('supports generic font loader', () => {
    const res = sorobornoFont('bornomala');
    expect(res.className).toBe('__font_bornomala');
    expect(res.variable).toBe('--font-bornomala');
  });
});

describe('@shoroborno/vite', () => {
  it('injects link tags in transformIndexHtml', () => {
    const plugin = sorobornoPlugin({ fonts: ['solaiman-lipi', 'kalpurush'] });
    const tags = plugin.transformIndexHtml('<html><head></head><body></body></html>');
    expect(tags.length).toBe(2);
    expect(tags[0].attrs.href).toContain('/solaiman-lipi/font.css');
    expect(tags[1].attrs.href).toContain('/kalpurush/font.css');
  });
});

describe('@shoroborno/nuxt', () => {
  it('configures nuxt head links', () => {
    const mod = defineSorobornoNuxtModule({ fonts: ['solaiman-lipi'] });
    const mockNuxt = { options: { app: { head: { link: [] as any[] } } } };
    mod.setup({}, mockNuxt);
    expect(mockNuxt.options.app.head.link.length).toBe(1);
    expect(mockNuxt.options.app.head.link[0].href).toContain('/solaiman-lipi/font.css');
  });
});
