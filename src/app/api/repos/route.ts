import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore - accessToken is added in callbacks
    const accessToken = session.accessToken;

    if (!accessToken) {
        return NextResponse.json({ error: 'No access token' }, { status: 400 });
    }

    try {
        const response = await fetch('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();

        // Return simplified repo data
        const simplifiedRepos = repos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            private: repo.private,
            default_branch: repo.default_branch,
            html_url: repo.html_url,
        }));

        return NextResponse.json(simplifiedRepos);
    } catch (error) {
        console.error('Error fetching repos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch repositories' },
            { status: 500 }
        );
    }
}
