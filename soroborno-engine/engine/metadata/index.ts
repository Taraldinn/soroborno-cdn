import type { DiscoveredFontPackage } from '../discovery/index.js';
import type { FontInspectionResult, FontMetadata, FontVariant, FontWeight, FontStyle, FontCategory } from '../types.js';
import { KNOWN_ALIASES } from '../discovery/index.js';

interface FrontmatterParsed {
  name?: string;
  designer?: string;
  designer_url?: string;
  version?: string;
  license?: string;
  license_url?: string;
  category?: string;
  subsets?: string[];
  weights?: (number | string)[];
  styles?: string[];
  description?: string;
  popularity?: number;
}

/**
 * Parses markdown frontmatter and content from _index.md
 */
export function parseIndexMarkdown(content: string): FrontmatterParsed {
  const result: FrontmatterParsed = {};
  if (!content) return result;

  // Check YAML frontmatter: --- ... ---
  const yamlMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  // Check TOML frontmatter: +++ ... +++
  const tomlMatch = content.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);

  const rawMeta = yamlMatch ? yamlMatch[1] : tomlMatch ? tomlMatch[1] : '';
  if (rawMeta) {
    const lines = rawMeta.split('\n');
    let currentKey = '';
    let inList = false;
    const listValues: string[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('- ') && inList) {
        listValues.push(line.substring(2).trim().replace(/^['"]|['"]$/g, ''));
        continue;
      }

      const colonIdx = line.indexOf(':');
      const eqIdx = line.indexOf('=');
      const sepIdx = colonIdx !== -1 ? colonIdx : eqIdx;

      if (sepIdx !== -1) {
        if (inList && currentKey) {
          (result as any)[currentKey] = [...listValues];
          listValues.length = 0;
          inList = false;
        }

        const key = line.substring(0, sepIdx).trim().toLowerCase().replace(/[-_]/g, '');
        const val = line.substring(sepIdx + 1).trim().replace(/^['"]|['"]$/g, '');

        if (!val) {
          currentKey = key;
          inList = true;
        } else {
          (result as any)[key] = val;
        }
      }
    }

    if (inList && currentKey && listValues.length > 0) {
      (result as any)[currentKey] = [...listValues];
    }
  }

  // Extract description: markdown body after frontmatter
  let body = content
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
    .replace(/^\+\+\+\r?\n[\s\S]*?\r?\n\+\+\+/, '')
    .trim();

  // Extract first non-heading paragraph for description
  const paragraphs = body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const firstNonHeader = paragraphs.find(p => !p.startsWith('#'));
  if (firstNonHeader) {
    result.description = firstNonHeader.replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/[*_`]/g, '');
  }

  return result;
}

function normalizeCategory(cat?: string): FontCategory {
  if (!cat) return 'bangla';
  const lower = cat.toLowerCase();
  if (lower.includes('serif') && !lower.includes('sans')) return 'serif';
  if (lower.includes('sans')) return 'sans-serif';
  if (lower.includes('display')) return 'display';
  if (lower.includes('handwriting') || lower.includes('script')) return 'handwriting';
  if (lower.includes('mono')) return 'monospace';
  return 'bangla';
}

/**
 * Merges discovered files, inspection results, and markdown metadata into a single normalized FontMetadata
 */
export function buildFontMetadata(
  pkg: DiscoveredFontPackage,
  inspections: { filePath: string; result: FontInspectionResult; woff2FileName?: string }[]
): FontMetadata {
  const md = pkg.indexMdContent ? parseIndexMarkdown(pkg.indexMdContent) : {};
  const primaryInspection = inspections[0]?.result;

  const familyName = md.name || primaryInspection?.family || pkg.rawFolderName;
  const displayName = familyName;

  // Build variants
  const variants: FontVariant[] = inspections.map(({ filePath, result, woff2FileName }) => {
    const originalFileName = filePath.split('/').pop() || '';
    const ext = originalFileName.split('.').pop()?.toLowerCase();

    return {
      weight: result.weight,
      style: result.style,
      originalFileName,
      files: {
        ...(ext === 'ttf' ? { ttf: originalFileName } : {}),
        ...(ext === 'otf' ? { otf: originalFileName } : {}),
        ...(woff2FileName ? { woff2: woff2FileName } : {})
      }
    };
  });

  // Extract unique weights & styles sorted numerically
  const weightSet = new Set<FontWeight>();
  const styleSet = new Set<FontStyle>();
  for (const v of variants) {
    weightSet.add(v.weight);
    styleSet.add(v.style);
  }
  const weights = Array.from(weightSet).sort((a, b) => a - b);
  const styles = Array.from(styleSet);

  // License detection
  let licenseName = md.license || primaryInspection?.licenseName || 'SIL OFL 1.1';
  let licenseUrl = md.license_url || primaryInspection?.licenseUrl || 'https://openfontlicense.org/';
  if (pkg.licenseFilePath && !md.license) {
    const licBase = pkg.licenseFilePath.toLowerCase();
    if (licBase.includes('ofl')) {
      licenseName = 'SIL OFL 1.1';
      licenseUrl = 'https://openfontlicense.org/';
    } else if (licBase.includes('apache')) {
      licenseName = 'Apache 2.0';
      licenseUrl = 'https://www.apache.org/licenses/LICENSE-2.0';
    }
  }

  // Find aliases
  const aliases: string[] = [];
  if (pkg.rawFolderName !== pkg.id) {
    aliases.push(pkg.rawFolderName);
  }
  for (const [legacyName, normalizedId] of Object.entries(KNOWN_ALIASES)) {
    if (normalizedId === pkg.id && !aliases.includes(legacyName)) {
      aliases.push(legacyName);
    }
  }

  return {
    id: pkg.id,
    family: familyName,
    displayName,
    description: md.description || `${familyName} is an open-source Bangla font for web and desktop typography.`,
    category: normalizeCategory(md.category),
    designer: md.designer || primaryInspection?.designer || 'Open Source Contributor',
    designerUrl: md.designer_url || primaryInspection?.designerUrl,
    version: md.version || primaryInspection?.version || '1.0',
    license: {
      name: licenseName,
      url: licenseUrl
    },
    subsets: ['bengali', 'latin'],
    weights: weights.length > 0 ? weights : [400],
    styles: styles.length > 0 ? styles : ['normal'],
    variants,
    aliases: aliases.length > 0 ? aliases : undefined,
    popularity: md.popularity ? Number(md.popularity) : 0
  };
}
