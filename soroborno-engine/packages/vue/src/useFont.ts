import {
  type FontMetadata,
  type FontWeight,
  type FontStyle,
  getFont,
  getFontStylesheetUrl
} from '@shoroborno/core';

export interface UseVueFontOptions {
  weights?: (FontWeight | number)[];
  styles?: FontStyle[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  cdnBaseUrl?: string;
}

export interface UseVueFontResult {
  className: string;
  style: Record<string, string>;
  family: string;
  load: () => Promise<void>;
}

const loadedVueStylesheets = new Set<string>();

/**
 * Vue 3 composable to load and apply Soroborno Bangla fonts
 *
 * @example
 * ```vue
 * <script setup>
 * import { useFont } from '@shoroborno/vue';
 * const font = useFont('solaiman-lipi');
 * </script>
 *
 * <template>
 *   <div :class="font.className">বাংলা লেখা</div>
 * </template>
 * ```
 */
export function useFont(
  fontIdOrMetadata: string | FontMetadata,
  options: UseVueFontOptions = {}
): UseVueFontResult {
  const font = typeof fontIdOrMetadata === 'string'
    ? getFont(fontIdOrMetadata)
    : fontIdOrMetadata;

  const fontId = typeof fontIdOrMetadata === 'string' ? fontIdOrMetadata : fontIdOrMetadata.id;
  const family = font?.family || fontId;
  const className = `font-${fontId}`;
  const fallback = font?.category === 'serif' ? 'serif' : font?.category === 'monospace' ? 'monospace' : 'sans-serif';

  const load = async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    if (loadedVueStylesheets.has(fontId)) return;

    return new Promise((resolve, reject) => {
      const linkId = `soroborno-font-${fontId}`;
      let existingLink = document.getElementById(linkId) as HTMLLinkElement | null;

      if (!existingLink) {
        existingLink = document.createElement('link');
        existingLink.id = linkId;
        existingLink.rel = 'stylesheet';
        existingLink.href = getFontStylesheetUrl(fontId, options.cdnBaseUrl);

        existingLink.onload = () => {
          loadedVueStylesheets.add(fontId);
          resolve();
        };

        existingLink.onerror = (e) => {
          reject(new Error(`Failed to load stylesheet for font '${fontId}'`));
        };

        document.head.appendChild(existingLink);
      } else {
        loadedVueStylesheets.add(fontId);
        resolve();
      }
    });
  };

  // Automatically trigger load on client
  if (typeof window !== 'undefined') {
    load().catch(() => {});
  }

  return {
    className,
    style: {
      fontFamily: `'${family}', ${fallback}`
    },
    family,
    load
  };
}
