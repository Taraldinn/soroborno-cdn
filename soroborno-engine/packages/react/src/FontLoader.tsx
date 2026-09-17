import React from 'react';
import { getFontStylesheetUrl } from '@shoroborno/core';

export interface FontLoaderProps {
  font: string;
  cdnBaseUrl?: string;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
}

/**
 * Declarative component to inject a Soroborno font stylesheet into head / DOM
 */
export function FontLoader({ font, cdnBaseUrl, crossOrigin = 'anonymous' }: FontLoaderProps) {
  const url = getFontStylesheetUrl(font, cdnBaseUrl);
  return (
    <link
      rel="stylesheet"
      href={url}
      crossOrigin={crossOrigin}
      data-soroborno-font={font}
    />
  );
}
