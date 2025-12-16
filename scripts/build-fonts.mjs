import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const fontsDir = path.join(process.cwd(), 'fonts');
const publicDir = path.join(process.cwd(), 'public');
const publicFontsDir = path.join(publicDir, 'fonts');
const dataDir = path.join(process.cwd(), 'src', 'data');

if (!fs.existsSync(publicFontsDir)) fs.mkdirSync(publicFontsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function formatName(slug) {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function parseWeightFromFilename(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('thin') || lower.includes('100')) return '100';
    if (lower.includes('extralight') || lower.includes('200')) return '200';
    if (lower.includes('light') || lower.includes('300')) return '300';
    if (lower.includes('regular') || lower.includes('400') || (!lower.includes('bold') && !lower.includes('medium'))) return '400';
    if (lower.includes('medium') || lower.includes('500')) return '500';
    if (lower.includes('semibold') || lower.includes('600')) return '600';
    if (lower.includes('bold') || lower.includes('700')) return '700';
    if (lower.includes('extrabold') || lower.includes('800')) return '800';
    if (lower.includes('black') || lower.includes('900')) return '900';
    return '400';
}

function parseInfo(filename) {
    const lower = filename.toLowerCase();
    let weight = 400;
    let style = 'normal';

    if (lower.includes('thin') || lower.includes('100')) weight = 100;
    else if (lower.includes('extralight') || lower.includes('200')) weight = 200;
    else if (lower.includes('light') || lower.includes('300')) weight = 300;
    else if (lower.includes('medium') || lower.includes('500')) weight = 500;
    else if (lower.includes('semibold') || lower.includes('600')) weight = 600;
    else if (lower.includes('bold') || lower.includes('700')) weight = 700;
    else if (lower.includes('extrabold') || lower.includes('800')) weight = 800;
    else if (lower.includes('black') || lower.includes('900')) weight = 900;

    if (lower.includes('italic')) style = 'italic';

    const ext = path.extname(filename).substring(1);
    const format = ext === 'ttf' ? 'truetype' : ext === 'otf' ? 'opentype' : ext;

    return { weight, style, format };
}

function parseIndexMd(content) {
    const result = {};
    const titleMatch = content.match(/title\s*=\s*"([^"]+)"/);
    if (titleMatch) result.name = titleMatch[1];

    const descMatch = content.match(/^#[^#\n]+\n+([^\n#]+)/m);
    if (descMatch) result.description = descMatch[1].trim();

    const designerMatch = content.match(/\*\*Designer:\*\*\s*(.+)/);
    if (designerMatch) result.designer = designerMatch[1].trim();

    const versionMatch = content.match(/\*\*Version:\*\*\s*(.+)/);
    if (versionMatch) result.version = versionMatch[1].trim();

    if (content.includes('SIL Open Font License')) {
        result.license = 'SIL OFL 1.1';
    } else if (content.includes('Apache')) {
        result.license = 'Apache 2.0';
    } else {
        result.license = 'Open Source';
    }
    return result;
}

const fonts = [];

if (fs.existsSync(fontsDir)) {
    const fontFolders = fs.readdirSync(fontsDir).filter(name => {
        return fs.statSync(path.join(fontsDir, name)).isDirectory();
    });

    for (const folder of fontFolders) {
        const srcPath = path.join(fontsDir, folder);
        const destPath = path.join(publicFontsDir, folder);

        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });

        // Recursive file finder
        function getFontFiles(dir, fileList = []) {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    getFontFiles(filePath, fileList);
                } else {
                    if (file.endsWith('.ttf') || file.endsWith('.woff') || file.endsWith('.woff2') || file.endsWith('.otf')) {
                        fileList.push(filePath);
                    }
                }
            });
            return fileList;
        }

        const allFontFiles = getFontFiles(srcPath);

        if (allFontFiles.length === 0) continue;

        const fontFileNames = [];

        // Copy font files (flattened)
        allFontFiles.forEach(sfp => {
            const filename = path.basename(sfp);
            fontFileNames.push(filename);
            fs.copyFileSync(sfp, path.join(destPath, filename));
        });

        // Metadata
        let metadata = {
            name: formatName(folder),
            description: `${formatName(folder)} font.`,
            designer: 'Unknown',
            version: '1.0',
            license: 'Open Source'
        };

        const indexPath = path.join(srcPath, '_index.md');
        if (fs.existsSync(indexPath)) {
            const indexContent = fs.readFileSync(indexPath, 'utf-8');
            metadata = { ...metadata, ...parseIndexMd(indexContent) };
        }

        // Generate CSS
        let css = `/* Generated by Soroborno CDN */\n\n`;
        fontFileNames.forEach(file => {
            const info = parseInfo(file);
            // Use relative path "./file.ttf"
            css += `@font-face {
  font-family: '${metadata.name}';
  src: url('./${file}') format('${info.format}');
  font-weight: ${info.weight};
  font-style: ${info.style};
  font-display: swap;
}\n\n`;
        });
        fs.writeFileSync(path.join(destPath, 'font.css'), css);

        const weights = [...new Set(fontFileNames.map(parseWeightFromFilename))].sort();

        // Generate Zip
        const zipFileName = `${folder}.zip`;
        const zipFilePath = path.join(destPath, zipFileName);

        // zip -j creates a flat zip (no directory structure inside)
        // We use spawnSync or execSync. 
        // We need to be careful with paths. 
        // Let's cd into destPath and zip all files.
        try {
            // Remove existing zip if any
            if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);

            // Zip all font files
            // -j: junk paths (do not store directory names)
            // -r: recurse (though we flattened them already in destPath)
            // We only want the font files in the zip, maybe the CSS too? User said "download all weight fonts". 
            // Including CSS is nice but maybe not required. Let's just include the font files (ttf, otf, woff, etc).
            // Actually, we flattened the files into destPath.
            // Let's just zip everything in destPath except other zips if any.
            // Command: zip -j [zipfile] [files...]

            const fileArgs = fontFileNames.map(f => `"${f}"`).join(' ');
            execSync(`zip -j "${zipFilePath}" ${fileArgs}`, { cwd: destPath });
            // console.log(`Created zip for ${folder}`);
        } catch (error) {
            console.error(`Error zipping ${folder}:`, error);
        }

        // In static export, files are in /fonts/[folder]/...
        // We can just use relative paths or absolute paths from root.
        // For the JSON, let's provide friendly URLs.
        // If hosted at domain.com/fonts/..., we might need a prefix if base path is used.
        // But usually /fonts/... works from root.

        fonts.push({
            slug: folder,
            name: metadata.name || folder,
            description: metadata.description || '',
            designer: metadata.designer || 'Unknown',
            version: metadata.version || '1.0',
            license: metadata.license || 'Open Source',
            weights,
            files: fontFileNames,
            cssUrl: `/fonts/${folder}/font.css`, // Absolute path from site root
            previewUrl: `/fonts/${folder}/${fontFileNames[0]}`,
            downloadUrl: `/fonts/${folder}/${folder}.zip`
        });
    }
}

// Write JSON data
fs.writeFileSync(path.join(dataDir, 'fonts.json'), JSON.stringify(fonts, null, 2));

console.log(`Generated static assets for ${fonts.length} fonts.`);
