"use client";

import { Chapter, Course, UserProgress } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

export const CourseSidebar = ({
    course,
    progressCount,
}: CourseSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold text-lg mb-4">
                    {course.title}
                </h1>

                {/* Progress Bar */}
                <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1 text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(progressCount)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                        <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressCount}%` }}
                        />
                    </div>
                </div>

                {/* Chat Button */}
                <Button
                    variant="outline"
                    className="w-full mt-4 gap-x-2 border-sky-500 text-sky-600 hover:bg-sky-50"
                    onClick={() => router.push(`/courses/${course.id}/chat`)}
                >
                    <MessageCircle className="h-4 w-4" />
                    Chat with Instructor
                </Button>
            </div>

            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => {
                    const id = chapter.id;
                    const isCompleted = chapter.userProgress?.[0]?.isCompleted;
                    const isLocked = !chapter.isFree && !isCompleted; // Simple logic, refine if strictly locked by purchase

                    const isActive = pathname?.includes(id);

                    return (
                        <button
                            key={id}
                            onClick={() => router.push(`/courses/${course.id}/chapters/${id}`)}
                            type="button"
                            className={cn(
                                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                                isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
                                isCompleted && "text-emerald-700 hover:text-emerald-700",
                                isCompleted && isActive && "bg-emerald-200/20"
                            )}
                        >
                            <div className="flex items-center gap-x-2 py-4">
                                {isCompleted ? (
                                    <CheckCircle size={22} className={cn("text-emerald-500", isActive && "text-emerald-700")} />
                                ) : (
                                    <PlayCircle size={22} className={cn("text-slate-500", isActive && "text-slate-700")} />
                                )}
                                {chapter.title}
                            </div>
                            <div className={cn(
                                "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
                                isActive && "opacity-100",
                                isCompleted && "border-emerald-700"
                            )} />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
