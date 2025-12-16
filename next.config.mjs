/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/fonts/:family/font.css',
                destination: '/api/cdn/css?family=:family',
            },
            {
                source: '/fonts/:family/:file',
                destination: '/api/cdn/file?family=:family&file=:file',
            },
        ];
    },
};

export default nextConfig;
