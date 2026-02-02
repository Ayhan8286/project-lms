import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { title } = await req.json(); // Usually "prompt" but let's see payload
        const { courseId, chapterId } = await params;

        // If we want to create a question, we need the quiz ID.
        // But the route is nested under chapter.
        // We find the quiz by chapterId.

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const quiz = await db.quiz.findUnique({
            where: {
                chapterId: chapterId,
            }
        });

        if (!quiz) {
            return new NextResponse("Quiz not found", { status: 404 });
        }

        const question = await db.question.create({
            data: {
                prompt: "New Question",
                quizId: quiz.id,
            },
        });

        return NextResponse.json(question);

    } catch (error) {
        console.log("[QUIZ_QUESTION_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
