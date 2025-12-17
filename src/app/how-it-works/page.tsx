import Link from 'next/link';
import { Terminal, GitPullRequest, ArrowRight, Copy, Check } from 'lucide-react';

export const metadata = {
    title: 'কিভাবে কাজ করে | স্বরবর্ন সিডিএন',
    description: 'কীভাবে স্বরবর্ন সিডিএন ব্যবহার করবেন এবং কন্ট্রিবিউট করবেন।',
};

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50 dark:from-sky-950/20 via-transparent to-transparent -z-10" />
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl -z-10">
                <div className="w-64 h-64 bg-sky-500 rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Usage Guide Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            ব্যবহারবিধি
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            আপনার ওয়েবসাইটে বাংলা ফন্ট যুক্ত করুন মাত্র ৩টি সহজ ধাপে।
                        </p>
                    </div>

                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">

                        {/* Step 1 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sky-500">
                                ১
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">ফন্ট নির্বাচন করুন</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    আমাদের <Link href="/fonts" className="text-sky-500 hover:underline">ফন্ট লাইব্রেরি</Link> ব্রাউজ করুন এবং আপনার পছন্দের ফন্টটি বেছে নিন।
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sky-500">
                                ২
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">CSS লিঙ্ক কপি করুন</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    ফন্ট ডিটেইলস পেজ থেকে বা কার্ড থেকে সরাসরি সিডিএন লিঙ্ক কপি করুন।
                                </p>
                                <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-600 dark:text-slate-400 overflow-x-auto">
                                    &lt;link href="https://cdn..." rel="stylesheet" /&gt;
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sky-500">
                                ৩
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">CSS-এ ব্যবহার করুন</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    আপনার CSS ফাইলে `font-family` প্রপার্টি দিয়ে ফন্টটি ব্যবহার করুন।
                                </p>
                                <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-600 dark:text-slate-400">
                                    font-family: 'Baloo Da 2', serif;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contribution Section */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mb-6">
                            <GitPullRequest className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            কিভাবে কন্ট্রিবিউট করবেন?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            ওপেন সোর্স কমিউনিটির অংশ হিসেবে আপনিও নতুন ফন্ট যুক্ত করতে পারেন। নিচের গাইডলাইন অনুসরণ করুন।
                        </p>
                    </div>

                    <div className="space-y-6 max-w-3xl mx-auto">
                        {/* Step 1: File Structure */}
                        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-start gap-4">
                                <div className="flex-none w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm">
                                    ১
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">ফোল্ডার স্ট্রাকচার</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        `fonts/` ডিরেক্টরির ভেতরে ফন্টের স্লাগ (slug) নাম দিয়ে একটি ফোল্ডার তৈরি করুন।
                                    </p>
                                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                        <div className="text-slate-400">fonts/</div>
                                        <div className="text-slate-400 pl-4">└── <span className="text-green-400">my-new-font</span>/</div>
                                        <div className="text-slate-400 pl-8">├── <span className="text-sky-400">_index.md</span></div>
                                        <div className="text-slate-400 pl-8">├── <span className="text-white">Author_Details.txt</span></div>
                                        <div className="text-slate-400 pl-8">├── <span className="text-white">MyFont-Regular.ttf</span></div>
                                        <div className="text-slate-400 pl-8">└── <span className="text-white">MyFont-Bold.ttf</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Metadata */}
                        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-start gap-4">
                                <div className="flex-none w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm">
                                    ২
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">মেটাডেটা (_index.md) যুক্ত করা</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        `_index.md` ফাইলে ফন্টের প্রয়োজনীয় তথ্য নিচের ফরম্যাটে লিখুন।
                                    </p>
                                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                        <div className="text-purple-400">+++</div>
                                        <div className="text-sky-300">title = "My New Font"</div>
                                        <div className="text-sky-300">weight = 10 <span className="text-slate-500">// Popularity score (optional)</span></div>
                                        <div className="text-purple-400">+++</div>
                                        <div className="text-slate-400 mt-2"># My New Font Description</div>
                                        <div className="text-slate-400 mt-2">## Font Information</div>
                                        <div className="text-sky-300">- **Version:** 1.0</div>
                                        <div className="text-sky-300">- **Designer:** [Name](url)</div>
                                        <div className="text-slate-400 mt-2">## License</div>
                                        <div className="text-slate-400">This font... (SIL OFL/Apache/etc)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <a
                            href="https://github.com/Taraldinn/soroborno-cdn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-sky-500/20"
                        >
                            <Terminal className="w-5 h-5" />
                            গিটহাব এ যান
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
