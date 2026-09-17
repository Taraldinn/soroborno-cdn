import { getFontStylesheetUrl } from '@shoroborno/core';

export interface ModuleOptions {
  fonts?: string[];
  cdnBaseUrl?: string;
  preload?: boolean;
}

/**
 * Nuxt 3 module definition for Soroborno fonts
 */
export function defineSorobornoNuxtModule(options: ModuleOptions = {}) {
  const fonts = options.fonts || [];
  const cdnBase = options.cdnBaseUrl;

  return {
    meta: {
      name: '@shoroborno/nuxt',
      configKey: 'soroborno',
      compatibility: {
        nuxt: '^3.0.0'
      }
    },
    setup(moduleOptions: ModuleOptions, nuxt: any) {
      const mergedOptions = { ...options, ...moduleOptions };
      const selectedFonts = mergedOptions.fonts || [];

      // Ensure nuxt.options.app.head exists
      nuxt.options.app = nuxt.options.app || {};
      nuxt.options.app.head = nuxt.options.app.head || {};
      nuxt.options.app.head.link = nuxt.options.app.head.link || [];

      for (const fontId of selectedFonts) {
        const url = getFontStylesheetUrl(fontId, mergedOptions.cdnBaseUrl);
        nuxt.options.app.head.link.push({
          rel: 'stylesheet',
          href: url,
          crossorigin: 'anonymous'
        });
      }
    }
  };
}

export default defineSorobornoNuxtModule;
