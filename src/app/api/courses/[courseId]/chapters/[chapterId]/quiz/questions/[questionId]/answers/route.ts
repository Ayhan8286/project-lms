import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string; questionId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, questionId } = await params;
        // const values = await req.json(); // May contain 'text' if needed, or default

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

        const answer = await db.answer.create({
            data: {
                text: "Option",
                questionId: questionId,
                isCorrect: false,
            },
        });

        return NextResponse.json(answer);

    } catch (error) {
        console.log("[ANSWER_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
