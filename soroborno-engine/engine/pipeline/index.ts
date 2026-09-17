import fs from 'node:fs';
import path from 'node:path';
import { discoverFonts } from '../discovery/index.js';
import { validateFontPackage } from '../validation/index.js';
import { inspectFontFile } from '../inspection/index.js';
import { convertAndSaveWoff2 } from '../conversion/index.js';
import { buildFontMetadata } from '../metadata/index.js';
import { generateFontCss } from '../css/index.js';
import type { FontMetadata, ValidationIssue } from '../types.js';

export interface PipelineOptions {
  fontsRootDir: string;
  outputDir: string;
  publicOutputDir?: string;
  dryRun?: boolean;
}

export interface PipelineSummary {
  totalDiscovered: number;
  processedCount: number;
  errorCount: number;
  fonts: FontMetadata[];
  validationIssues: Record<string, ValidationIssue[]>;
}

/**
 * Runs the complete font processing pipeline
 */
export async function runFontPipeline(options: PipelineOptions): Promise<PipelineSummary> {
  const { fontsRootDir, outputDir, publicOutputDir, dryRun } = options;

  console.log(`\n🚀 [Soroborno Engine] Starting Font Processing Pipeline`);
  console.log(`   Source fonts: ${fontsRootDir}`);
  console.log(`   Target generated dir: ${outputDir}`);
  if (publicOutputDir) {
    console.log(`   Public distribution dir: ${publicOutputDir}`);
  }

  // 1. Discovery
  const discovered = discoverFonts(fontsRootDir);
  console.log(`\n📦 Discovered ${discovered.length} font package candidates.`);

  const generatedFonts: FontMetadata[] = [];
  const validationIssues: Record<string, ValidationIssue[]> = {};
  let errorCount = 0;

  for (const pkg of discovered) {
    console.log(`\n🔍 Processing '${pkg.id}' (Folder: ${pkg.rawFolderName})...`);

    // 2. Validation
    const validation = validateFontPackage(pkg);
    validationIssues[pkg.id] = validation.issues;

    for (const issue of validation.issues) {
      if (issue.severity === 'error') {
        console.error(`   ❌ [${issue.code}] ${issue.message}`);
      } else {
        console.warn(`   ⚠️  [${issue.code}] ${issue.message}`);
      }
    }

    if (!validation.valid) {
      console.error(`   ⛔ Skipping '${pkg.id}' due to validation errors.`);
      errorCount++;
      continue;
    }

    // 3. Inspection & Conversion
    const inspections: { filePath: string; result: any; woff2FileName?: string }[] = [];
    const fontOutDir = path.join(outputDir, 'fonts', pkg.id);
    const publicFontOutDir = publicOutputDir ? path.join(publicOutputDir, pkg.id) : undefined;

    if (!dryRun) {
      if (!fs.existsSync(fontOutDir)) fs.mkdirSync(fontOutDir, { recursive: true });
      if (publicFontOutDir && !fs.existsSync(publicFontOutDir)) {
        fs.mkdirSync(publicFontOutDir, { recursive: true });
      }
    }

    for (const fontPath of pkg.fontFilePaths) {
      const inspectRes = inspectFontFile(fontPath);
      const originalFileName = path.basename(fontPath);
      const ext = path.extname(fontPath);
      const baseName = path.basename(fontPath, ext);

      // Generate clean standard woff2 filename
      const woff2FileName = `${pkg.id}-${inspectRes.weight}-${inspectRes.style}.woff2`;

      if (!dryRun) {
        // Copy original file
        fs.copyFileSync(fontPath, path.join(fontOutDir, originalFileName));
        if (publicFontOutDir) {
          fs.copyFileSync(fontPath, path.join(publicFontOutDir, originalFileName));
        }

        // Convert to WOFF2
        const targetWoff2Path = path.join(fontOutDir, woff2FileName);
        const conv = await convertAndSaveWoff2(fontPath, targetWoff2Path);

        if (publicFontOutDir) {
          fs.copyFileSync(targetWoff2Path, path.join(publicFontOutDir, woff2FileName));
        }

        console.log(
          `   ✓ Converted ${originalFileName} → ${woff2FileName} (${(conv.originalSize / 1024).toFixed(0)}KB → ${(conv.woff2Size / 1024).toFixed(0)}KB, saved ${conv.compressionRatio})`
        );
      }

      inspections.push({
        filePath: fontPath,
        result: inspectRes,
        woff2FileName
      });
    }

    // 4. Metadata Generation
    const metadata = buildFontMetadata(pkg, inspections);
    generatedFonts.push(metadata);

    // 5. CSS Generation
    const css = generateFontCss(metadata, { includeUtilityClass: true });
    if (!dryRun) {
      fs.writeFileSync(path.join(fontOutDir, 'font.css'), css, 'utf-8');
      fs.writeFileSync(path.join(fontOutDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');

      if (publicFontOutDir) {
        fs.writeFileSync(path.join(publicFontOutDir, 'font.css'), css, 'utf-8');
      }

      // Also copy license if present
      if (pkg.licenseFilePath && fs.existsSync(pkg.licenseFilePath)) {
        const licName = path.basename(pkg.licenseFilePath);
        fs.copyFileSync(pkg.licenseFilePath, path.join(fontOutDir, licName));
        if (publicFontOutDir) {
          fs.copyFileSync(pkg.licenseFilePath, path.join(publicFontOutDir, licName));
        }
      }
    }

    console.log(`   ✨ Generated metadata and CSS for '${metadata.displayName}'`);
  }

  // 6. Global Manifest & TypeScript exports
  if (!dryRun) {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // Write fonts.json
    const fontsJsonPath = path.join(outputDir, 'fonts.json');
    fs.writeFileSync(fontsJsonPath, JSON.stringify(generatedFonts, null, 2), 'utf-8');

    // Write fonts.ts typed file
    const fontsTsContent = generateFontsTypeScriptFile(generatedFonts);
    fs.writeFileSync(path.join(outputDir, 'fonts.ts'), fontsTsContent, 'utf-8');
  }

  console.log(`\n🎉 [Soroborno Engine] Pipeline Completed:`);
  console.log(`   Successfully processed: ${generatedFonts.length} fonts`);
  console.log(`   Validation errors: ${errorCount}`);

  return {
    totalDiscovered: discovered.length,
    processedCount: generatedFonts.length,
    errorCount,
    fonts: generatedFonts,
    validationIssues
  };
}

/**
 * Generates typed TypeScript constants and registry
 */
function generateFontsTypeScriptFile(fonts: FontMetadata[]): string {
  const code: string[] = [
    `// This file is auto-generated by the Soroborno Font Engine. Do not edit directly.\n`,
    `import type { FontMetadata } from './types.js';\n`,
    `export const fonts: FontMetadata[] = ${JSON.stringify(fonts, null, 2)};\n`,
    `export const fontMap = new Map<string, FontMetadata>(fonts.map(f => [f.id, f]));\n`
  ];

  // Also export each font as individual camelCase constant
  for (const font of fonts) {
    const camelCase = font.id
      .replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase())
      .replace(/^[0-9]/, '_$&');
    code.push(`export const ${camelCase}: FontMetadata = ${JSON.stringify(font, null, 2)};`);
  }

  return code.join('\n') + '\n';
}
