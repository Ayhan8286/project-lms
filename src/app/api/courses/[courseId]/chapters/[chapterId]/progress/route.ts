import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;
        const { isCompleted } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                chapterId,
                isCompleted,
            }
        });

        if (isCompleted) {
            const points = await db.userPoints.findUnique({
                where: { userId }
            });

            if (points) {
                await db.userPoints.update({
                    where: { userId },
                    data: { xp: { increment: 10 } }
                });
            } else {
                await db.userPoints.create({
                    data: { userId, xp: 10, level: 1 }
                });
            }
        }

        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
