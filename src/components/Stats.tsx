import { Server, Zap, Activity, Globe } from 'lucide-react';
import fonts from '../data/fonts.json';

export function Stats() {
    const stats = [
        {
            label: 'মোট ফন্ট',
            value: `${fonts.length}+`,
            icon: Server,
            color: 'text-purple-500',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            label: 'গ্লোবাল সিডিএন',
            value: 'jsDelivr',
            icon: Globe,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            label: 'আপটাইম',
            value: '৯৯.৯%',
            icon: Activity,
            color: 'text-green-500',
            bg: 'bg-green-100 dark:bg-green-900/30'
        },
        {
            label: 'রিকুয়েস্ট',
            value: 'আনলিমিটেড',
            icon: Zap,
            color: 'text-orange-500',
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        }
    ];

    return (
        <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-4 group">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
