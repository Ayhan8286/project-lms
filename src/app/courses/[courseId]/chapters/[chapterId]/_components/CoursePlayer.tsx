"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti";
import { Chapter, Course, UserProgress, Invoice } from "@prisma/client";
import { CertificateButton } from "@/components/CertificateButton";

interface CoursePlayerProps {
    chapter: Chapter;
    course: Course;
    nextChapter: Chapter | null;
    userProgress: UserProgress | null;
    purchase: Invoice | null;
    chapters: (Chapter & { userProgress: UserProgress[] })[];
    completeOnEnd: boolean;
    userName: string;
}

export const CoursePlayer = ({
    chapter,
    course,
    nextChapter,
    userProgress,
    purchase,
    chapters,
    completeOnEnd,
    userName,
}: CoursePlayerProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const isLocked = !chapter.isFree && !purchase && course.price !== 0;

    const navId = (id: string) => `/courses/${course.id}/chapters/${id}`;

    const markComplete = async (isCompleted: boolean) => {
        try {
            setIsLoading(true);
            await fetch(`/api/courses/${course.id}/chapters/${chapter.id}/progress`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCompleted }),
            });

            if (isCompleted && !userProgress?.isCompleted) {
                confetti.onOpen();
                toast.success("Progress saved");
            } else {
                toast.success("Progress updated");
            }

            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col md:flex-row bg-background">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Video Player */}
                <div className="relative aspect-video bg-black flex items-center justify-center">
                    {isLocked ? (
                        <div className="flex flex-col items-center justify-center text-white">
                            <Lock className="h-16 w-16 mb-4" />
                            <p className="text-xl font-semibold">This chapter is locked</p>
                            <Link href={`/courses/${course.id}`} className="mt-4 bg-sky-700 px-4 py-2 rounded-md hover:bg-sky-600 transition">
                                Enroll to Watch
                            </Link>
                        </div>
                    ) : chapter.videoUrl ? (
                        <video
                            controls
                            className="w-full h-full"
                            src={chapter.videoUrl}
                            onEnded={() => {
                                if (completeOnEnd && !userProgress?.isCompleted) {
                                    markComplete(true);
                                }
                                if (nextChapter) {
                                    router.push(navId(nextChapter.id));
                                }
                            }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="text-white text-center">
                            <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-sm opacity-75">No video uploaded yet</p>
                        </div>
                    )}
                </div>

                {/* Chapter Info */}
                <div className="p-6 flex-1 overflow-auto">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-foreground">{chapter.title}</h1>
                    </div>
                    <div className="text-muted-foreground mb-6 text-sm">
                        {chapter.description || "No description available"}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-x-4 mt-8 items-center">
                        {/* We don't have prevChapter easily available from getChapter unless we compute it or pass it. 
                            Let's compute it from 'chapters' list.
                        */}
                        {(() => {
                            const currentIndex = chapters.findIndex(c => c.id === chapter.id);
                            const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;

                            return prevChapter ? (
                                <Link href={navId(prevChapter.id)}>
                                    <button className="flex items-center gap-x-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition">
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                </Link>
                            ) : null;
                        })()}

                        {!userProgress?.isCompleted ? (
                            <button
                                onClick={() => markComplete(true)}
                                disabled={isLoading}
                                className="flex items-center gap-x-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark as Complete
                            </button>
                        ) : (
                            <button
                                onClick={() => markComplete(false)}
                                disabled={isLoading}
                                className="flex items-center gap-x-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Completed
                            </button>
                        )}

                        {nextChapter && (
                            <Link href={navId(nextChapter.id)}>
                                <button className="flex items-center gap-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition ml-auto">
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Chapter Sidebar */}
            <div className="md:w-80 border-l border-border bg-card overflow-auto max-h-screen">
                <div className="p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground">Course Content</h2>
                    <p className="text-xs text-muted-foreground mt-1">{chapters.length} chapters</p>
                </div>
                <div className="p-2">
                    {chapters.map((ch, index) => {
                        const isCurrent = ch.id === chapter.id;
                        const isCompleted = ch.userProgress?.[0]?.isCompleted;

                        return (
                            <Link
                                key={ch.id}
                                href={navId(ch.id)}
                            >
                                <div
                                    className={`flex items-center gap-x-3 p-3 rounded-md mb-1 cursor-pointer transition ${isCurrent
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    <div className={`flex-shrink-0 ${isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        ) : ch.isFree ? (
                                            <PlayCircle className="h-4 w-4" />
                                        ) : (
                                            <Lock className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'
                                            }`}>
                                            {index + 1}. {ch.title}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <div className="p-4 border-t">
                    {(() => {
                        const progressCount = chapters.filter(c => c.userProgress?.[0]?.isCompleted).length;
                        const isCompleted = progressCount === chapters.length;

                        if (isCompleted) {
                            return (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-emerald-600 mb-2">🎉 Course Completed!</p>
                                    {/* We need student name here, can be passed or fetched, for now 'Student' */}
                                    <CertificateButton courseName={course.title} studentName={userName} />
                                </div>
                            );
                        }
                        return (
                            <div className="text-xs text-muted-foreground text-center">
                                {Math.round((progressCount / chapters.length) * 100)}% Complete
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};
