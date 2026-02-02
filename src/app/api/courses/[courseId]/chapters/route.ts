import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;

        const chapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
            },
            include: {
                userProgress: {
                    where: {
                        userId: userId || "null_user",
                    }
                }
            },
            orderBy: {
                position: "asc",
            },
        });

        return NextResponse.json(chapters);
    } catch (error) {
        console.log("[CHAPTERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();
        const { courseId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Verify course ownership
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get the last chapter to set position
        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition,
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CHAPTERS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
