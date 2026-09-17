export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontStyle = 'normal' | 'italic' | 'oblique';

export type FontCategory = 'bangla' | 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';

export interface LicenseInfo {
  name: string;
  url?: string;
  text?: string;
  file?: string;
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
  postScriptName?: string;
  originalFileName: string;
}

export interface FontMetadata {
  id: string; // Normalized kebab-case ID (e.g. "solaiman-lipi")
  family: string; // OpenType family name (e.g. "SolaimanLipi")
  displayName: string;
  description: string;
  category: FontCategory;
  designer: string;
  designerUrl?: string;
  version: string;
  license: LicenseInfo;
  subsets: string[]; // e.g. ["bengali", "latin"]
  weights: FontWeight[];
  styles: FontStyle[];
  variants: FontVariant[];
  sourceRepo?: string;
  popularity?: number;
  aliases?: string[];
}

export interface ValidationIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  file?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface FontInspectionResult {
  family: string;
  subfamily: string;
  weight: FontWeight;
  style: FontStyle;
  version: string;
  designer?: string;
  designerUrl?: string;
  licenseName?: string;
  licenseUrl?: string;
  hasBengaliUnicode: boolean;
  glyphCount: number;
}
