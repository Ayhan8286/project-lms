import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string; questionId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, questionId } = await params;
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

        const question = await db.question.update({
            where: {
                id: questionId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(question);

    } catch (error) {
        console.log("[QUESTION_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string; questionId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, questionId } = await params;

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

        const question = await db.question.delete({
            where: {
                id: questionId,
            },
        });

        return NextResponse.json(question);

    } catch (error) {
        console.log("[QUESTION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
