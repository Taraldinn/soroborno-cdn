import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/next";
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FontProvider } from '@/components/FontProvider';
import { SettingsDrawer } from '@/components/SettingsDrawer';

export const metadata: Metadata = {
    title: 'স্বরবর্ন সিডিএন - ওপেন সোর্স বাংলা ফন্ট লাইব্রেরি',
    description: 'গিটহাবের মাধ্যমে আপনার পছন্দের ফন্টগুলো সিডিএন হিসেবে ব্যবহার করুন। বাংলা এবং অন্যান্য ফন্টের বিশাল সংগ্রহ।',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bn" suppressHydrationWarning>
            <body
                className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300"
                suppressHydrationWarning
            >
                <ThemeProvider>
                    <FontProvider>
                        <div className="min-h-screen">
                            <Navbar />
                            <main>{children}</main>
                            <SettingsDrawer />
                            <Analytics />
                        </div>
                    </FontProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
