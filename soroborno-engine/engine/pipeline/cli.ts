import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runFontPipeline } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const fontsRootDir = process.env.FONT_REPO_DIR || path.resolve(__dirname, '../../../fonts');
  const outputDir = process.env.OUTPUT_DIR || path.resolve(__dirname, '../../generated');
  const publicOutputDir = process.env.PUBLIC_DIR || path.resolve(__dirname, '../../../public/fonts');

  try {
    const summary = await runFontPipeline({
      fontsRootDir,
      outputDir,
      publicOutputDir
    });

    if (summary.errorCount > 0) {
      console.warn(`\n⚠️  Engine completed with ${summary.errorCount} skipped fonts.`);
    } else {
      console.log(`\n✨ All fonts processed successfully!`);
    }
  } catch (err) {
    console.error('Fatal engine error:', err);
    process.exit(1);
  }
}

main();
