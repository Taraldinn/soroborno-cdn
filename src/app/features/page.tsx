import { Zap, Globe, Shield, Code, Server, Github } from 'lucide-react';

export const metadata = {
    title: 'বৈশিষ্ট্য | স্বরবর্ন সিডিএন',
    description: 'স্বরবর্ন সিডিএন এর মূল বৈশিষ্ট্যসমূহ - দ্রুত, নিরাপদ এবং ডেভেলপার-বান্ধব।',
};

export default function FeaturesPage() {
    const features = [
        {
            icon: Zap,
            title: 'সুপার ফাস্ট পারফরম্যান্স',
            description: 'jsDelivr এর গ্লোবাল সিডিএন নেটওয়ার্ক ব্যবহার করে আমরা নিশ্চিত করি আপনার ফন্টগুলো পৃথিবীর যেকোনো প্রান্ত থেকে মুহূর্তেই লোড হয়। লো লেটেন্সি এবং হাই থ্রুপুট আমাদের প্রতিশ্রুতি।',
        },
        {
            icon: Globe,
            title: 'বাংলার জন্য অপ্টিমাইজড',
            description: 'অন্যান্য সিডিএন এর মতো নয়, আমরা বাংলা ফন্টের জন্য বিশেষ অপ্টিমাইজেশন প্রদান করি। ইউনিকোড রেঞ্জ সাবসেটিং এবং ফন্ট কমপ্রেশন এর মাধ্যমে ফাইলের সাইজ রাখা হয় ন্যূনতম।',
        },
        {
            icon: Github,
            title: 'ওপেন সোর্স কমিউনিটি',
            description: 'পুরো প্রজেক্টটি গিটহাব-এ ওপেন সোর্স। আপনি চাইলে নতুন ফন্ট যোগ করতে পারেন, বাগ ফিক্স করতে পারেন অথবা নতুন ফিচার এর জন্য রিকোয়েস্ট করতে পারেন।',
        },
        {
            icon: Code,
            title: 'ডেভেলপার এক্সপেরিয়েন্স',
            description: 'সহজ ইন্টিগ্রেশন। মাত্র এক লাইন CSS কোড দিয়ে আপনার ওয়েবসাইটে ফন্ট যুক্ত করুন। কোনো জটিল কনফিগারেশন বা মেইনটেনেন্স এর ঝামেলা নেই।',
        },
        {
            icon: Shield,
            title: 'প্রাইভেসি ফোকাসড',
            description: 'আমরা কোনো ট্র্যাকিং কুকি ব্যবহার করি না। আপনার এবং আপনার ইউজারদের প্রাইভেসি আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। সম্পূর্ণ নিরাপদ এবং ট্র্যাকার-মুক্ত।',
        },
        {
            icon: Server,
            title: 'নির্ভরযোগ্য আপটাইম',
            description: 'গিটহাব এবং jsDelivr এর ইনফ্রাস্ট্রাকচার এর উপর ভিত্তি করে তৈরি হওয়ায় আমরা ৯৯.৯% আপটাইম এর নিশ্চয়তা দিতে পারি। আপনার সাইট কখনো ফন্ট মিস করবে না।',
        },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50 dark:from-sky-950/20 via-transparent to-transparent -z-10" />
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl -z-10">
                <div className="w-64 h-64 bg-sky-500 rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        কেন ব্যবহার করবেন <span className="text-sky-500">স্বরবর্ন সিডিএন?</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        আধুনিক ওয়েবের জন্য তৈরি একটি ফন্ট সিডিএন, যা আপনার ডেভেলপমেন্ট প্রসেসকে করে আরও সহজ এবং দ্রুত।
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-6 h-6 text-sky-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
