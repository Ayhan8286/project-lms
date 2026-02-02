import Link from 'next/link';
import { LayoutDashboard, Compass, Settings, CreditCard, Heart, CalendarCheck, BarChart, MessageCircle, List, User, Bell, Shield, GraduationCap, BookOpen, FileSpreadsheet, Video, Megaphone } from 'lucide-react';
import { cn } from "@/lib/utils";

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'text-sky-500',
    },
    {
        label: 'Browse Courses',
        icon: Compass,
        href: '/search',
        color: 'text-violet-500',
    },
    {
        label: 'Wishlist',
        icon: Heart,
        href: '/wishlist',
        color: 'text-rose-500',
    },
    {
        label: 'Fees & Billing',
        icon: CreditCard,
        href: '/billing',
        color: 'text-emerald-500',
    },
    {
        label: 'Attendance',
        icon: CalendarCheck,
        href: '/dashboard/attendance',
        color: 'text-orange-500',
    },
    {
        label: 'Teacher Profile',
        icon: Settings,
        href: '/teacher/profile',
        color: 'text-gray-500',
    },
    {
        label: 'Teacher Analytics',
        icon: BarChart,
        href: '/teacher/analytics',
        color: 'text-green-700',
    },
    {
        label: 'Teacher Chat',
        icon: MessageCircle,
        href: '/teacher/chat',
        color: 'text-blue-700',
    },
    {
        label: 'Manage Courses',
        icon: List,
        href: '/teacher/courses',
        color: 'text-pink-700',
    },
    {
        label: 'Affiliate',
        icon: CreditCard,
        href: '/affiliate',
        color: 'text-yellow-600',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/settings',
    },
    {
        label: 'Fees',
        icon: CreditCard,
        href: '/parent/fees', // Wait, we made fees specific to child: /parent/child/[id]/fees.
        // We probably need a Parent Root dashboard or listing.
        // For now, let's just stick to "Parent Dashboard" which lists children.
        // "Parent Chat" is global though.
    },
    {
        label: 'Overview',
        icon: User,
        href: '/parent/dashboard',
        color: 'text-indigo-600',
    },
    {
        label: 'Chat with Teachers',
        icon: MessageCircle,
        href: '/parent/chat',
        color: 'text-emerald-600',
    },
    {
        label: 'Notifications',
        icon: Bell,
        href: '/parent/notifications',
        color: 'text-orange-600',
    },
    {
        label: 'Admin: Students',
        icon: Shield,
        href: '/admin/students',
        color: 'text-red-700',
    },
    {
        label: 'Admin: Teachers',
        icon: GraduationCap,
        href: '/admin/teachers',
        color: 'text-purple-700',
    },
    {
        label: 'Admin: Courses',
        icon: BookOpen,
        href: '/admin/courses',
        color: 'text-blue-700',
    },
    {
        label: 'Admin: Subjects',
        icon: List,
        href: '/admin/categories',
        color: 'text-pink-700',
    },
    {
        label: 'Admin: Analytics',
        icon: BarChart,
        href: '/admin/analytics',
        color: 'text-green-700',
    },
    {
        label: 'Admin: Fees',
        icon: CreditCard,
        href: '/admin/invoices',
        color: 'text-yellow-700',
    },
    {
        label: 'Admin: Reports',
        icon: FileSpreadsheet,
        href: '/admin/reports',
        color: 'text-gray-700',
    },
    {
        label: 'Admin: Live Audit',
        icon: Video,
        href: '/admin/live-classes',
        color: 'text-red-500',
    },
    {
        label: 'Admin: Settings',
        icon: Settings,
        href: '/admin/settings',
        color: 'text-slate-500',
    },
    {
        label: 'Admin: Broadcast',
        icon: Megaphone,
        href: '/admin/notifications',
        color: 'text-orange-600',
    }
];

export const Sidebar = () => {
    return (
        <div className={cn(
            "space-y-4 py-4 flex flex-col h-full border-r border-slate-200 dark:border-slate-800",
            "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm transition-all"
        )}>
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                        Al Huda
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition",
                                "hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/10",
                                "text-zinc-600 dark:text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
