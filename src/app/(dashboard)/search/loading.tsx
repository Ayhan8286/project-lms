import { CoursesListSkeleton } from "@/components/CoursesListSkeleton";

export default function Loading() {
    return (
        <div className="p-6 space-y-4">
            {/* Simulate Categories */}
            <div className="flex overflow-x-auto pb-2 gap-x-2">
                <div className="w-20 h-8 bg-slate-200 rounded-full animate-pulse" />
                <div className="w-20 h-8 bg-slate-200 rounded-full animate-pulse" />
                <div className="w-20 h-8 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <CoursesListSkeleton />
        </div>
    );
}
