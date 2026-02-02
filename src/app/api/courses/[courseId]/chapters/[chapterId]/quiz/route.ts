import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();
        const { courseId, chapterId } = await params;

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

        const quiz = await db.quiz.create({
            data: {
                title,
                chapterId: chapterId,
                courseId: courseId,
            },
        });

        return NextResponse.json(quiz);

    } catch (error) {
        console.log("[QUIZ_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();
        const { courseId, chapterId } = await params;

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

        const quiz = await db.quiz.update({
            where: {
                chapterId: chapterId,
            },
            data: {
                title,
            },
        });

        return NextResponse.json(quiz);

    } catch (error) {
        console.log("[QUIZ_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
