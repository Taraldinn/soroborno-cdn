import { getFontStylesheetUrl } from '@shoroborno/core';

export interface AstroFontOptions {
  fonts: string[];
  cdnBaseUrl?: string;
}

/**
 * Astro integration to inject Soroborno font stylesheets
 */
export function sorobornoAstro(options: AstroFontOptions) {
  const { fonts = [], cdnBaseUrl } = options;

  return {
    name: '@shoroborno/astro',
    hooks: {
      'astro:config:setup': ({ injectScript }: any) => {
        for (const fontId of fonts) {
          const url = getFontStylesheetUrl(fontId, cdnBaseUrl);
          injectScript('head-inline', `
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '${url}';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
          `);
        }
      }
    }
  };
}

export default sorobornoAstro;
