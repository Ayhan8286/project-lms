import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;
        const { instruction } = await req.json();

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

        // Check if assignment exists
        const existingAssignment = await db.assignment.findUnique({
            where: {
                chapterId: chapterId,
            }
        });

        if (existingAssignment) {
            const assignment = await db.assignment.update({
                where: {
                    chapterId: chapterId,
                },
                data: {
                    instruction,
                },
            });
            return NextResponse.json(assignment);
        } else {
            const assignment = await db.assignment.create({
                data: {
                    chapterId: chapterId,
                    instruction,
                },
            });
            return NextResponse.json(assignment);
        }

    } catch (error) {
        console.log("[ASSIGNMENT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
