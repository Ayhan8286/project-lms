import Link from 'next/link';
import { List, BarChart, ArrowLeft } from 'lucide-react';

const routes = [
    {
        label: 'Courses',
        icon: List,
        href: '/courses',
        color: 'text-indigo-500',
    },
    {
        label: 'Analytics',
        icon: BarChart,
        href: '/analytics',
        color: 'text-emerald-500',
    },
];

export const TeacherSidebar = () => {
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14 hover:text-slate-300 transition">
                    <ArrowLeft className="h-5 w-5 mr-3" />
                    <h1 className="text-sm font-medium">
                        Exit Teacher Mode
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={`/teacher${route.href}`}
                            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition"
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={`h-5 w-5 mr-3 ${route.color}`} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
