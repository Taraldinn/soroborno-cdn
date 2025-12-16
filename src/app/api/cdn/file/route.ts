import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const family = searchParams.get('family');
    const file = searchParams.get('file');

    if (!family || !file) {
        return new NextResponse('File not specified', { status: 400 });
    }

    // Security check: prevent directory traversal
    if (family.includes('..') || file.includes('..')) {
        return new NextResponse('Invalid path', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'fonts', family, file);

    if (!fs.existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    try {
        const stats = fs.statSync(filePath);
        const data = fs.readFileSync(filePath);

        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes: Record<string, string> = {
            '.ttf': 'font/ttf',
            '.otf': 'font/otf',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.css': 'text/css',
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';

        return new NextResponse(data, {
            headers: {
                'Content-Type': contentType,
                'Content-Length': stats.size.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('File Serve Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
