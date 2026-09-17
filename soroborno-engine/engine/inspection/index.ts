import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import type { FontInspectionResult, FontWeight, FontStyle } from '../types.js';

// Key Bengali Unicode characters to verify Bengali script coverage
const BENGALI_PROBE_CHARS = ['\u0985', '\u0986', '\u0995', '\u0996', '\u09AC', '\u09BE', '\u09BF', '\u09CD'];

function normalizeWeight(rawWeight: number | undefined, filename: string): FontWeight {
  if (rawWeight && rawWeight >= 100 && rawWeight <= 900) {
    // Round to nearest 100
    const rounded = (Math.round(rawWeight / 100) * 100) as FontWeight;
    if ([100, 200, 300, 400, 500, 600, 700, 800, 900].includes(rounded)) {
      return rounded;
    }
  }

  const lower = filename.toLowerCase();
  if (lower.includes('thin') || lower.includes('100')) return 100;
  if (lower.includes('extralight') || lower.includes('ultra-light') || lower.includes('200')) return 200;
  if (lower.includes('light') || lower.includes('300')) return 300;
  if (lower.includes('medium') || lower.includes('500')) return 500;
  if (lower.includes('semibold') || lower.includes('semi-bold') || lower.includes('600')) return 600;
  if (lower.includes('extrabold') || lower.includes('extra-bold') || lower.includes('800')) return 800;
  if (lower.includes('bold') || lower.includes('700')) return 700;
  if (lower.includes('black') || lower.includes('heavy') || lower.includes('900')) return 900;
  return 400;
}

function normalizeStyle(fsSelection: number | undefined, macStyle: number | undefined, subfamily: string, filename: string): FontStyle {
  const isItalicBit = fsSelection ? (fsSelection & 1) !== 0 : false;
  const isMacItalic = macStyle ? (macStyle & 2) !== 0 : false;
  const subLower = (subfamily || '').toLowerCase();
  const fileLower = filename.toLowerCase();

  if (isItalicBit || isMacItalic || subLower.includes('italic') || fileLower.includes('italic') || fileLower.includes('700i') || fileLower.includes('400i')) {
    return 'italic';
  }
  if (subLower.includes('oblique') || fileLower.includes('oblique')) {
    return 'oblique';
  }
  return 'normal';
}

function getEnglishName(nameRecord: any): string | undefined {
  if (!nameRecord) return undefined;
  if (typeof nameRecord === 'string') return nameRecord;
  return nameRecord.en || Object.values(nameRecord)[0] as string || undefined;
}

/**
 * Inspects a font binary file using opentype.js table parsing with resilient fallbacks
 */
export function inspectFontFile(filePath: string): FontInspectionResult {
  const filename = path.basename(filePath);
  const buffer = fs.readFileSync(filePath);

  let font: opentype.Font | null = null;
  try {
    // ArrayBuffer conversion for opentype
    const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    font = opentype.parse(ab);
  } catch (err: any) {
    // Fall back to filename heuristic if parsing failed
  }

  if (font) {
    const family = getEnglishName(font.names.fontFamily) || filename.replace(/\.[^/.]+$/, '');
    const subfamily = getEnglishName(font.names.fontSubfamily) || 'Regular';
    const rawWeight = font.tables.os2?.usWeightClass;
    const weight = normalizeWeight(rawWeight, filename);
    const style = normalizeStyle(
      font.tables.os2?.fsSelection,
      font.tables.head?.macStyle,
      subfamily,
      filename
    );

    const version = getEnglishName(font.names.version) || '1.0';
    const designer = getEnglishName(font.names.designer);
    const designerUrl = getEnglishName(font.names.designerURL);
    const licenseName = getEnglishName(font.names.license);
    const licenseUrl = getEnglishName(font.names.licenseURL);

    // Check Bengali glyph coverage
    let bengaliMatchCount = 0;
    for (const char of BENGALI_PROBE_CHARS) {
      const glyphIndex = font.charToGlyphIndex(char);
      if (glyphIndex > 0) {
        bengaliMatchCount++;
      }
    }
    const hasBengaliUnicode = bengaliMatchCount >= 4;
    const glyphCount = font.glyphs?.length || 0;

    return {
      family,
      subfamily,
      weight,
      style,
      version,
      designer,
      designerUrl,
      licenseName,
      licenseUrl,
      hasBengaliUnicode,
      glyphCount
    };
  }

  // Fallback if binary parsing failed
  return {
    family: filename.replace(/\.[^/.]+$/, ''),
    subfamily: 'Regular',
    weight: normalizeWeight(undefined, filename),
    style: normalizeStyle(undefined, undefined, '', filename),
    version: '1.0',
    hasBengaliUnicode: true,
    glyphCount: 0
  };
}
