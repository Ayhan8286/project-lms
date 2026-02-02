import { CoursesListSkeleton } from "@/components/CoursesListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-card rounded-xl shadow-sm border border-border flex items-center gap-x-4 h-32">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-12" />
                    </div>
                </div>
                <div className="p-6 bg-card rounded-xl shadow-sm border border-border flex items-center gap-x-4 h-32">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-12" />
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <CoursesListSkeleton />
            </div>
        </div>
    );
}
