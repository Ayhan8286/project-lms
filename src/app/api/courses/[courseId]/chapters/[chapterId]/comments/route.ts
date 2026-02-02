import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;
        const { content } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const comment = await db.comment.create({
            data: {
                content,
                chapterId: chapterId,
                userId,
            }
        });

        return NextResponse.json(comment);

    } catch (error) {
        console.log("[COMMENTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
