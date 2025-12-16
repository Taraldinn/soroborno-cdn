import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
    title: 'Webfont CDN - Free Font Hosting via GitHub',
    description: 'Push fonts to GitHub, get instant CDN URLs. Free, open-source webfont delivery powered by jsDelivr.',
    keywords: ['webfont', 'cdn', 'font hosting', 'github', 'jsdelivr', 'free fonts'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
                <Providers>
                    <div className="min-h-screen">
                        <Navbar />
                        <main>{children}</main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
