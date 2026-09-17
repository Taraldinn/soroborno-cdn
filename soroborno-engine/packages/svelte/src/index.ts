import { getFontStylesheetUrl, getFont } from '@shoroborno/core';

export interface SvelteFontOptions {
  font: string;
  cdnBaseUrl?: string;
}

/**
 * Svelte Action: loads font stylesheet and sets font-family on node
 *
 * @example
 * ```html
 * <h1 use:sorobornoFont={'solaiman-lipi'}>আমার সোনার বাংলা</h1>
 * ```
 */
export function sorobornoFont(node: HTMLElement, options: string | SvelteFontOptions) {
  const fontId = typeof options === 'string' ? options : options.font;
  const cdnBase = typeof options === 'string' ? undefined : options.cdnBaseUrl;

  const font = getFont(fontId);
  const family = font?.family || fontId;
  const fallback = font?.category === 'serif' ? 'serif' : 'sans-serif';

  // Inject stylesheet if not present
  if (typeof document !== 'undefined') {
    const linkId = `soroborno-svelte-${fontId}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = getFontStylesheetUrl(fontId, cdnBase);
      document.head.appendChild(link);
    }
  }

  node.style.fontFamily = `'${family}', ${fallback}`;
  node.classList.add(`font-${fontId}`);

  return {
    update(newOptions: string | SvelteFontOptions) {
      const newFontId = typeof newOptions === 'string' ? newOptions : newOptions.font;
      const newFont = getFont(newFontId);
      node.style.fontFamily = `'${newFont?.family || newFontId}', ${fallback}`;
    },
    destroy() {
      node.classList.remove(`font-${fontId}`);
    }
  };
}
