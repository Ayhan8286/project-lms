import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import { CoursePlayer } from "./_components/CoursePlayer";
import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { NoteWidget } from "@/components/NoteWidget";
import { CourseAttachments } from "./_components/CourseAttachments";
import { AssignmentCard } from "./_components/AssignmentCard";
import { QuizApp } from "./_components/QuizApp";
import { LiveClassroom } from "./_components/LiveClassroom";

export default async function ChapterPage({
    params
}: {
    params: Promise<{ courseId: string; chapterId: string }>
}) {
    const { userId } = await auth();
    const user = await currentUser();
    const { courseId, chapterId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
        chapters,
    } = await getChapter({
        userId,
        chapterId,
        courseId,
    });

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase && course.price !== 0;

    if (isLocked) {
        return redirect(`/courses/${courseId}`);
    }

    return (
        <>
            <div className="p-4 w-full">
                {(chapter as any).isLive ? (
                    <LiveClassroom
                        courseId={courseId}
                        chapterId={chapterId}
                        userName={user?.fullName || "Student"}
                    />
                ) : (
                    <CoursePlayer
                        chapter={chapter}
                        course={course}
                        nextChapter={nextChapter}
                        userProgress={userProgress}
                        purchase={purchase}
                        chapters={chapters}
                        completeOnEnd={true}
                        userName={user?.fullName || "Student"}
                    />
                )}
            </div>

            {chapter.quiz && (
                <div className="px-6 mb-6">
                    <QuizApp
                        courseId={courseId}
                        chapterId={chapterId}
                        quiz={chapter.quiz as any}
                        initialStats={typeof userProgress?.score === 'number' ? {
                            score: userProgress.score,
                            passed: userProgress.isCompleted
                        } : null}
                    />
                </div>
            )}

            {chapter.assignment && (
                <div className="px-6 mb-6">
                    <AssignmentCard
                        courseId={courseId}
                        chapterId={chapterId}
                        assignment={chapter.assignment}
                        currentUserId={userId}
                    />
                </div>
            )}

            {attachments.length > 0 && (
                <div className="px-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">Course Resources</h3>
                    <CourseAttachments attachments={attachments} />
                </div>
            )}

            <div className="pt-8 pb-16">
                <h3 className="text-xl font-bold mb-4">Community Q&A</h3>
                <div className="mb-6">
                    <CommentForm courseId={courseId} chapterId={chapterId} />
                </div>
                <CommentList items={chapter.comments} />
            </div>

            <NoteWidget courseId={courseId} chapterId={chapterId} />
        </>
    );
}
