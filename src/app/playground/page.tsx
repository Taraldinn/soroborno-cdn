import PlaygroundEditor from '@/components/PlaygroundEditor';

export const metadata = {
    title: 'প্লেগ্রাউন্ড | স্বরবর্ন সিডিএন',
    description: 'Avro Phonetic সাপোর্ট সহ মার্কডাউন এডিটর।',
};

export default function PlaygroundPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50 dark:from-sky-950/20 via-transparent to-transparent -z-10" />
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl -z-10">
                <div className="w-64 h-64 bg-sky-500 rounded-full" />
            </div>

            {/* Load Common Bangla Fonts manually for the playground */}
            <link rel="stylesheet" href="/fonts/Tiro_Bangla/font.css" />
            <link rel="stylesheet" href="/fonts/kalpurush/font.css" />
            <link rel="stylesheet" href="/fonts/Hind_Siliguri/font.css" />
            <link rel="stylesheet" href="/fonts/solaiman-lipi/font.css" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        রাইটার <span className="text-sky-500">প্লেগ্রাউন্ড</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        এখানে আপনি বাংলা টাইপ করতে পারেন এবং মার্কডাউন ফরম্যাটে এক্সপোর্ট করতে পারেন।
                    </p>
                </div>

                <PlaygroundEditor />
            </div>
        </div>
    );
}
