import { getFontStylesheetUrl } from '@soroborno/core';

export interface VitePluginOptions {
  fonts: string[];
  cdnBaseUrl?: string;
  crossOrigin?: boolean;
}

/**
 * Vite plugin for automatically injecting and bundling Soroborno Bangla fonts
 */
export function sorobornoPlugin(options: VitePluginOptions) {
  const { fonts = [], cdnBaseUrl, crossOrigin = true } = options;

  return {
    name: 'vite-plugin-soroborno',
    transformIndexHtml(html: string) {
      const tags = fonts.map(fontId => {
        const url = getFontStylesheetUrl(fontId, cdnBaseUrl);
        return {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: url,
            ...(crossOrigin ? { crossorigin: 'anonymous' } : {})
          },
          injectTo: 'head-prepend' as const
        };
      });

      return tags;
    }
  };
}

export default sorobornoPlugin;
