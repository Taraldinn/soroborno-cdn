import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FontInfo {
    slug: string;
    name: string;
    description: string;
    designer: string;
    version: string;
    license: string;
    weights: string[];
    files: string[];
    cssUrl: string;
    previewUrl: string;
}

function parseIndexMd(content: string): Partial<FontInfo> {
    const result: Partial<FontInfo> = {};

    // Extract title from frontmatter
    const titleMatch = content.match(/title\s*=\s*"([^"]+)"/);
    if (titleMatch) result.name = titleMatch[1];

    // Extract description (first paragraph after # heading)
    const descMatch = content.match(/^#[^#\n]+\n+([^\n#]+)/m);
    if (descMatch) result.description = descMatch[1].trim();

    // Extract designer from "Designer:" line
    const designerMatch = content.match(/\*\*Designer:\*\*\s*(.+)/);
    if (designerMatch) result.designer = designerMatch[1].trim();

    // Extract version
    const versionMatch = content.match(/\*\*Version:\*\*\s*(.+)/);
    if (versionMatch) result.version = versionMatch[1].trim();

    // Extract license
    if (content.includes('SIL Open Font License')) {
        result.license = 'SIL OFL 1.1';
    } else if (content.includes('Apache')) {
        result.license = 'Apache 2.0';
    } else {
        result.license = 'Open Source';
    }

    return result;
}

function parseWeightFromFilename(filename: string): string {
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

// Helper to format directory name to human readable name
// e.g. "baloo-da-2" -> "Baloo Da 2"
function formatName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export async function GET() {
    try {
        const fontsDir = path.join(process.cwd(), 'fonts');

        if (!fs.existsSync(fontsDir)) {
            return NextResponse.json({ fonts: [], error: 'Fonts directory not found' });
        }

        const fontFolders = fs.readdirSync(fontsDir).filter(name => {
            const fullPath = path.join(fontsDir, name);
            return fs.statSync(fullPath).isDirectory();
        });

        const fonts: FontInfo[] = [];

        for (const folder of fontFolders) {
            const fontPath = path.join(fontsDir, folder);
            const files = fs.readdirSync(fontPath);

            // Get font files
            const fontFiles = files.filter(f =>
                f.endsWith('.ttf') || f.endsWith('.woff') || f.endsWith('.woff2') || f.endsWith('.otf')
            );

            if (fontFiles.length === 0) continue;

            // Initialize with default values derived from folder name
            let metadata: Partial<FontInfo> = {
                name: formatName(folder),
                description: `${formatName(folder)} font.`,
                designer: 'Unknown',
                version: '1.0',
                license: 'Open Source'
            };

            // Try to parse metadata from _index.md if it exists, but don't require it
            const indexPath = path.join(fontPath, '_index.md');
            if (fs.existsSync(indexPath)) {
                const indexContent = fs.readFileSync(indexPath, 'utf-8');
                metadata = { ...metadata, ...parseIndexMd(indexContent) };
            }

            // Get weights from font files
            const weights = [...new Set(fontFiles.map(parseWeightFromFilename))].sort();

            // Always point to our dynamic CSS route now
            // This ensures CSS works even if font.css doesn't exist on disk
            const cssUrl = `/fonts/${folder}/font.css`;

            fonts.push({
                slug: folder,
                name: metadata.name || folder,
                description: metadata.description || '',
                designer: metadata.designer || 'Unknown',
                version: metadata.version || '1.0',
                license: metadata.license || 'Open Source',
                weights,
                files: fontFiles,
                cssUrl,
                previewUrl: `/fonts/${folder}/${fontFiles[0]}`, // Points to dynamic file route via rewrite
            });
        }

        // Sort alphabetically
        fonts.sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json({ fonts, count: fonts.length });
    } catch (error) {
        console.error('Error reading fonts:', error);
        return NextResponse.json({ error: 'Failed to read fonts' }, { status: 500 });
    }
}
