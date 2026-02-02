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
        const { fileUrl, fileName } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const assignment = await db.assignment.findUnique({
            where: {
                chapterId: chapterId,
            }
        });

        if (!assignment) {
            return new NextResponse("Assignment not found", { status: 404 });
        }

        // Upsert submission
        const submission = await db.assignmentSubmission.upsert({
            where: {
                assignmentId_userId: {
                    assignmentId: assignment.id,
                    userId: userId
                }
            },
            update: {
                fileUrl,
                fileName,
            },
            create: {
                assignmentId: assignment.id,
                userId,
                fileUrl,
                fileName,
            }
        });

        return NextResponse.json(submission);

    } catch (error) {
        console.log("[ASSIGNMENT_SUBMIT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
