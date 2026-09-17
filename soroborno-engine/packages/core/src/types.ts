export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontStyle = 'normal' | 'italic' | 'oblique';
export type FontFormat = 'woff2' | 'woff' | 'ttf' | 'otf';
export type FontCategory = 'bangla' | 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';

export interface LicenseInfo {
  name: string;
  url?: string;
  text?: string;
}

export interface FontVariantFiles {
  ttf?: string;
  otf?: string;
  woff?: string;
  woff2?: string;
}

export interface FontVariant {
  weight: FontWeight;
  style: FontStyle;
  files: FontVariantFiles;
  originalFileName: string;
}

export interface FontMetadata {
  id: string;
  family: string;
  displayName: string;
  description: string;
  category: FontCategory;
  designer: string;
  designerUrl?: string;
  version: string;
  license: LicenseInfo;
  subsets: string[];
  weights: FontWeight[];
  styles: FontStyle[];
  variants: FontVariant[];
  aliases?: string[];
  popularity?: number;
}

export interface GetFontUrlOptions {
  weight?: FontWeight | number;
  style?: FontStyle;
  format?: FontFormat;
  cdnBaseUrl?: string;
}

export interface GetFontCssOptions {
  weights?: (FontWeight | number)[];
  styles?: FontStyle[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  cdnBaseUrl?: string;
  includeUtilityClass?: boolean;
}
