import fs from 'node:fs';
import type { DiscoveredFontPackage } from '../discovery/index.js';
import type { ValidationIssue, ValidationResult } from '../types.js';

/**
 * Validates a font binary's magic bytes to ensure it is a valid TTF/OTF/WOFF/WOFF2 file.
 */
export function validateFontBinaryHeader(filePath: string): { valid: boolean; format: string; error?: string } {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(4);
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);

    const tag = buffer.toString('binary');
    const hex = buffer.toString('hex');

    // TrueType: 0x00010000 or 'true'
    if (hex === '00010000' || tag === 'true') {
      return { valid: true, format: 'truetype' };
    }
    // OpenType CFF: 'OTTO'
    if (tag === 'OTTO') {
      return { valid: true, format: 'opentype' };
    }
    // WOFF: 'wOFF'
    if (tag === 'wOFF') {
      return { valid: true, format: 'woff' };
    }
    // WOFF2: 'wOF2'
    if (tag === 'wOF2') {
      return { valid: true, format: 'woff2' };
    }

    return {
      valid: false,
      format: 'unknown',
      error: `Invalid font file header: ${hex} (${tag})`
    };
  } catch (err: any) {
    return {
      valid: false,
      format: 'unknown',
      error: `Failed to read file: ${err.message}`
    };
  }
}

/**
 * Permissible open source license identifiers
 */
const ACCEPTABLE_LICENSES = [
  'ofl',
  'sil ofl',
  'sil open font license',
  'apache',
  'apache 2.0',
  'apache-2.0',
  'mit',
  'gpl',
  'gpl with font exception',
  'open source'
];

/**
 * Validates license presence and permissibility
 */
export function validateLicense(pkg: DiscoveredFontPackage): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const hasLicenseFile = Boolean(pkg.licenseFilePath && fs.existsSync(pkg.licenseFilePath));
  let indexMdHasLicense = false;

  if (pkg.indexMdContent) {
    const lower = pkg.indexMdContent.toLowerCase();
    indexMdHasLicense = ACCEPTABLE_LICENSES.some(lic => lower.includes(lic));
  }

  if (!hasLicenseFile && !indexMdHasLicense) {
    issues.push({
      severity: 'error',
      code: 'MISSING_LICENSE',
      message: `Font '${pkg.id}' has no explicit LICENSE or OFL file and no open-source license declared in _index.md.`,
      file: pkg.folderPath
    });
  } else if (!hasLicenseFile && indexMdHasLicense) {
    issues.push({
      severity: 'warning',
      code: 'NO_LICENSE_FILE',
      message: `Font '${pkg.id}' declared license in _index.md but is missing a standalone LICENSE/OFL.txt file.`,
      file: pkg.folderPath
    });
  }

  return issues;
}

/**
 * Full validation of a discovered font package
 */
export function validateFontPackage(pkg: DiscoveredFontPackage): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (pkg.fontFilePaths.length === 0) {
    issues.push({
      severity: 'error',
      code: 'NO_FONT_FILES',
      message: `Font '${pkg.id}' contains no valid .ttf or .otf font files.`,
      file: pkg.folderPath
    });
  }

  for (const fontPath of pkg.fontFilePaths) {
    const headerCheck = validateFontBinaryHeader(fontPath);
    if (!headerCheck.valid) {
      issues.push({
        severity: 'error',
        code: 'INVALID_BINARY_HEADER',
        message: `Font file '${fontPath}' is not a valid TrueType or OpenType binary: ${headerCheck.error}`,
        file: fontPath
      });
    }
  }

  // License validation
  issues.push(...validateLicense(pkg));

  const hasErrors = issues.some(i => i.severity === 'error');
  return {
    valid: !hasErrors,
    issues
  };
}
