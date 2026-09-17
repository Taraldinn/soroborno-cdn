import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_REPO_URL = 'https://github.com/Taraldinn/soroborno-cdn.git';
const TARGET_DIR = path.resolve(__dirname, '../fonts-repo');

/**
 * Synchronizes the external font repository (via shallow git clone or pull)
 */
export function syncFontRepository(repoUrl = DEFAULT_REPO_URL, targetDir = TARGET_DIR): void {
  console.log(`📡 Synchronizing font repository from ${repoUrl}...`);

  if (fs.existsSync(path.join(targetDir, '.git'))) {
    console.log(`   Pulling latest font updates into ${targetDir}...`);
    execSync(`git -C "${targetDir}" pull --ff-only origin main`, { stdio: 'inherit' });
  } else {
    console.log(`   Cloning font repository into ${targetDir}...`);
    execSync(`git clone --depth 1 "${repoUrl}" "${targetDir}"`, { stdio: 'inherit' });
  }

  const fontsPath = path.join(targetDir, 'fonts');
  if (!fs.existsSync(fontsPath)) {
    throw new Error(`Invalid font repository: missing 'fonts/' directory at ${fontsPath}`);
  }

  console.log(`✅ Font repository successfully synchronized!`);
}

if (process.argv[1] === __filename) {
  syncFontRepository();
}
