import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string; submissionId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, submissionId } = await params;
        const { grade, feedback } = await req.json();

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

        const submission = await db.assignmentSubmission.update({
            where: {
                id: submissionId,
            },
            data: {
                grade,
                feedback,
            },
        });

        return NextResponse.json(submission);

    } catch (error) {
        console.log("[SUBMISSION_GRADE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
