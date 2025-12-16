import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

// Supported font extensions
const FONT_EXTENSIONS = ['.woff', '.woff2', '.ttf', '.otf'];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string[] }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const accessToken = session.accessToken;

    // Await params in Next.js 16
    const { slug } = await params;
    const [owner, repo] = slug;

    if (!owner || !repo) {
        return NextResponse.json({ error: 'Invalid repository' }, { status: 400 });
    }

    try {
        // Get repository default branch
        const repoResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (!repoResponse.ok) {
            throw new Error('Failed to fetch repository');
        }

        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch;

        // Get repository tree
        const treeResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (!treeResponse.ok) {
            throw new Error('Failed to fetch tree');
        }

        const treeData = await treeResponse.json();

        // Filter font files
        const fonts = treeData.tree
            .filter((item: any) => {
                if (item.type !== 'blob') return false;
                const ext = item.path.toLowerCase().slice(item.path.lastIndexOf('.'));
                return FONT_EXTENSIONS.includes(ext);
            })
            .map((item: any) => {
                const ext = item.path.toLowerCase().slice(item.path.lastIndexOf('.'));
                const fileName = item.path.split('/').pop() || item.path;
                const familyName = extractFamilyName(fileName);
                const weight = extractWeight(fileName);
                const style = extractStyle(fileName);

                return {
                    path: item.path,
                    fileName,
                    sha: item.sha,
                    size: item.size,
                    format: ext.replace('.', ''),
                    familyName,
                    weight,
                    style,
                    cdnUrl: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${defaultBranch}/${item.path}`,
                };
            });

        return NextResponse.json({
            repository: {
                owner,
                name: repo,
                full_name: `${owner}/${repo}`,
                default_branch: defaultBranch,
            },
            fonts,
        });
    } catch (error) {
        console.error('Error fetching fonts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch fonts' },
            { status: 500 }
        );
    }
}

// Helper functions to extract font metadata from filename
function extractFamilyName(fileName: string): string {
    // Remove extension and weight/style indicators
    let name = fileName.replace(/\.(woff2?|ttf|otf)$/i, '');
    name = name.replace(/[-_]?(thin|extralight|light|regular|medium|semibold|bold|extrabold|black|italic|oblique)/gi, '');
    name = name.replace(/[-_]?(\d{3})/g, ''); // Remove numeric weights
    name = name.trim().replace(/[-_]+$/, '');
    return name || fileName.replace(/\.[^.]+$/, '');
}

function extractWeight(fileName: string): number {
    const lower = fileName.toLowerCase();
    const weights: Record<string, number> = {
        thin: 100,
        hairline: 100,
        extralight: 200,
        ultralight: 200,
        light: 300,
        regular: 400,
        normal: 400,
        medium: 500,
        semibold: 600,
        demibold: 600,
        bold: 700,
        extrabold: 800,
        ultrabold: 800,
        black: 900,
        heavy: 900,
    };

    for (const [name, weight] of Object.entries(weights)) {
        if (lower.includes(name)) return weight;
    }

    // Check for numeric weight
    const match = lower.match(/(\d{3})/);
    if (match) {
        const w = parseInt(match[1]);
        if (w >= 100 && w <= 900) return w;
    }

    return 400;
}

function extractStyle(fileName: string): string {
    const lower = fileName.toLowerCase();
    if (lower.includes('italic') || lower.includes('oblique')) {
        return 'italic';
    }
    return 'normal';
}
