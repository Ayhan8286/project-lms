import { SignIn } from "@clerk/nextjs";
import { GraduationCap } from "lucide-react";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400 to-slate-900 gap-y-6 p-4">
            <div className="flex flex-col items-center gap-y-2 text-white drop-shadow-md">
                <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                    <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold">Al Huda Network</h1>
                <p className="text-slate-200">Login to continue your learning journey</p>
            </div>
            <div className="w-full max-w-md bg-white/5 backdrop-blur-sm p-2 rounded-2xl shadow-2xl border border-white/10 flex justify-center">
                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary:
                                "bg-emerald-600 hover:bg-emerald-700 text-sm normal-case",
                            rootBox: "w-full",
                            card: "shadow-none bg-transparent border-none w-full",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            footerAction: "text-slate-200",
                            footerActionLink: "text-emerald-400 hover:text-emerald-300"
                        }
                    }}
                />
            </div>
        </div>
    );
}
