import fs from 'node:fs';
import path from 'node:path';

export interface DiscoveredFontPackage {
  id: string; // Normalized kebab-case ID (e.g. "solaiman-lipi")
  rawFolderName: string; // Original folder name (e.g. "Bornomala Vintage")
  folderPath: string;
  fontFilePaths: string[]; // Absolute paths to .ttf, .otf files
  licenseFilePath?: string;
  indexMdPath?: string;
  indexMdContent?: string;
}

/**
 * Normalizes a folder name or family name into kebab-case font ID
 */
export function normalizeFontId(name: string): string {
  return name
    .trim()
    .replace(/[_\s]+/g, '-') // Replace underscores and spaces with hyphen
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove special characters
    .replace(/-+/g, '-') // Deduplicate hyphens
    .toLowerCase();
}

/**
 * Known folder aliases for backward compatibility with existing CDN URLs
 */
export const KNOWN_ALIASES: Record<string, string> = {
  'Bornomala Vintage': 'bornomala-vintage',
  'Google_Sans': 'google-sans',
  'Hind_Siliguri': 'hind-siliguri',
  'July-Font': 'july-font',
  'Kohinoor Bangla': 'kohinoor-bangla',
  'Nirlipta Lite': 'nirlipta-lite',
  'Osman Hadi': 'osman-hadi',
  'Potro Sans Bangla': 'potro-sans-bangla',
  'FN Masud Chowa': 'fn-masud-chowa',
  'Tiro_Bangla': 'tiro-bangla',
  'Abirvab': 'abirvab',
  'Anirban': 'anirban',
  'Bornomala': 'bornomala',
  'Boshonto': 'boshonto',
  'Chilekotha': 'chilekotha',
  'DROHO': 'droho',
  'Purno': 'purno',
  'Shurjo': 'shurjo',
  'Sorob': 'sorob'
};

const IGNORED_NAMES = new Set(['.ds_store', '__macosx', 'thumbs.db', '.git']);

/**
 * Recursively discovers font files in a directory, ignoring system junk
 */
function findFontFiles(dir: string): string[] {
  const results: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const lower = entry.name.toLowerCase();
      if (IGNORED_NAMES.has(lower) || entry.name.startsWith('._')) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findFontFiles(fullPath));
      } else if (entry.isFile()) {
        if (lower.endsWith('.ttf') || lower.endsWith('.otf')) {
          results.push(fullPath);
        }
      }
    }
  } catch {
    // Ignore read errors
  }
  return results;
}

/**
 * Scans the font directory and returns discovered font packages
 */
export function discoverFonts(fontsRootDir: string): DiscoveredFontPackage[] {
  if (!fs.existsSync(fontsRootDir)) {
    throw new Error(`Fonts directory not found at: ${fontsRootDir}`);
  }

  const entries = fs.readdirSync(fontsRootDir, { withFileTypes: true });
  const packages: DiscoveredFontPackage[] = [];
  const seenIds = new Set<string>();

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const lower = entry.name.toLowerCase();
    if (IGNORED_NAMES.has(lower) || entry.name.startsWith('.')) continue;

    const folderPath = path.join(fontsRootDir, entry.name);
    const fontFiles = findFontFiles(folderPath);

    if (fontFiles.length === 0) {
      continue;
    }

    const id = normalizeFontId(entry.name);
    
    // Check for license file in the root of the font folder
    let licenseFilePath: string | undefined;
    const subEntries = fs.readdirSync(folderPath);
    for (const sub of subEntries) {
      const subLower = sub.toLowerCase();
      if (
        subLower === 'license' ||
        subLower === 'license.txt' ||
        subLower === 'license.md' ||
        subLower === 'ofl.txt' ||
        subLower === 'ofl.md'
      ) {
        licenseFilePath = path.join(folderPath, sub);
        break;
      }
    }

    // Check for _index.md
    let indexMdPath: string | undefined;
    let indexMdContent: string | undefined;
    const indexPath = path.join(folderPath, '_index.md');
    if (fs.existsSync(indexPath)) {
      indexMdPath = indexPath;
      try {
        indexMdContent = fs.readFileSync(indexPath, 'utf-8');
      } catch {
        // ignore read error
      }
    }

    // Deduplicate if multiple folders map to the same id (e.g. Tiro_Bangla vs tiro-bangla)
    if (seenIds.has(id)) {
      // Find existing and merge files if needed
      const existing = packages.find(p => p.id === id);
      if (existing) {
        for (const ff of fontFiles) {
          if (!existing.fontFilePaths.some(p => path.basename(p) === path.basename(ff))) {
            existing.fontFilePaths.push(ff);
          }
        }
        if (!existing.licenseFilePath && licenseFilePath) {
          existing.licenseFilePath = licenseFilePath;
        }
        if (!existing.indexMdContent && indexMdContent) {
          existing.indexMdPath = indexMdPath;
          existing.indexMdContent = indexMdContent;
        }
      }
      continue;
    }

    seenIds.add(id);
    packages.push({
      id,
      rawFolderName: entry.name,
      folderPath,
      fontFilePaths: fontFiles,
      licenseFilePath,
      indexMdPath,
      indexMdContent
    });
  }

  return packages.sort((a, b) => a.id.localeCompare(b.id));
}
