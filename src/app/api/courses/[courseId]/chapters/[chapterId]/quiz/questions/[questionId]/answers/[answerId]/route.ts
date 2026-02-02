import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string; questionId: string; answerId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, answerId, questionId } = await params;
        const values = await req.json();

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

        // Check if we are setting this answer to isCorrect=true
        // If so, we might want to unset others? Or allow multiple correct?
        // MCQ typically has one correct. Let's enforce single correct for now if `isCorrect` is passed.

        if (values.isCorrect) {
            await db.answer.updateMany({
                where: {
                    questionId: questionId,
                    isCorrect: true, // Only update existing true ones
                },
                data: {
                    isCorrect: false,
                }
            });
        }

        const answer = await db.answer.update({
            where: {
                id: answerId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(answer);

    } catch (error) {
        console.log("[ANSWER_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string; questionId: string; answerId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, answerId } = await params;

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

        const answer = await db.answer.delete({
            where: {
                id: answerId,
            },
        });

        return NextResponse.json(answer);

    } catch (error) {
        console.log("[ANSWER_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
