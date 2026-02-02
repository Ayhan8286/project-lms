import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { gradeQuiz } from "@/lib/quiz-engine"; // Assuming this exists as seen in step 214

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;
        const { quizId, answers } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const result = await gradeQuiz(quizId, answers);

        if (result.passed) {
            // Update UserProgress for this chapter
            await db.userProgress.upsert({
                where: {
                    userId_chapterId: {
                        userId,
                        chapterId,
                    }
                },
                update: {
                    isCompleted: true,
                    score: Math.round(result.score),
                },
                create: {
                    userId,
                    chapterId,
                    isCompleted: true,
                    score: Math.round(result.score),
                }
            });

            // Create Notification
            const chapter = await db.chapter.findUnique({
                where: { id: chapterId },
                select: { title: true }
            });

            if (chapter) {
                await db.notification.create({
                    data: {
                        userId,
                        title: "Quiz Passed! 🎉",
                        message: `Congratulations! You passed the quiz in "${chapter.title}" with a score of ${Math.round(result.score)}%.`,
                    }
                });
            }
        }

        return NextResponse.json(result);

    } catch (error) {
        console.log("[QUIZ_GRADE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
