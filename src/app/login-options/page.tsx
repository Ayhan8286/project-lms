import Link from "next/link";
import { GraduationCap, Users, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginOptionsPage() {
    const roles = [
        {
            label: "Student",
            description: "Access your courses, quizzes, and progress.",
            icon: User,
            href: "/sign-in?redirect_url=/dashboard",
            color: "bg-emerald-500",
            gradient: "from-emerald-500 to-teal-600"
        },
        {
            label: "Teacher",
            description: "Manage courses, assignments, and students.",
            icon: GraduationCap,
            href: "/sign-in?redirect_url=/teacher/analytics",
            color: "bg-blue-500",
            gradient: "from-blue-500 to-indigo-600"
        },
        {
            label: "Parent",
            description: "Monitor your child's attendance and grades.",
            icon: Users,
            href: "/sign-in?redirect_url=/parent/dashboard",
            color: "bg-purple-500",
            gradient: "from-purple-500 to-pink-600"
        },
        {
            label: "Admin",
            description: "System configuration and user management.",
            icon: Shield,
            href: "/sign-in?redirect_url=/admin/analytics",
            color: "bg-slate-700",
            gradient: "from-slate-700 to-slate-900"
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                <p className="text-slate-600 dark:text-slate-400">Select your role to continue to your dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
                {roles.map((role) => (
                    <Link key={role.label} href={role.href} className="group">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-full shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                            {/* Background Gradient on Hover */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${role.gradient}`} />

                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 text-white shadow-lg bg-gradient-to-br ${role.gradient}`}>
                                <role.icon className="h-7 w-7" />
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 dark:group-hover:from-white dark:group-hover:to-slate-300">
                                {role.label}
                            </h2>

                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                {role.description}
                            </p>

                            <Button className={`w-full bg-slate-900 dark:bg-slate-800 text-white border-0 group-hover:opacity-90`}>
                                Login as {role.label}
                            </Button>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>Don&apos;t have an account? <Link href="/sign-up" className="text-emerald-600 hover:underline">Sign up here</Link></p>
            </div>
        </div>
    );
}
