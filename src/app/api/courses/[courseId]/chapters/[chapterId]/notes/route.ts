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
        const { content, time } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const note = await db.note.create({
            data: {
                userId,
                chapterId,
                content,
                time,
            }
        });

        return NextResponse.json(note);

    } catch (error) {
        console.log("[NOTE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { chapterId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const notes = await db.note.findMany({
            where: {
                userId,
                chapterId,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(notes);

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
