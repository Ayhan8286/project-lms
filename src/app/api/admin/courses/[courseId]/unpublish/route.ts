import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        // Admin force unpublish (Reject)
        const unpublishedCourse = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                isPublished: false,
            }
        });

        return NextResponse.json(unpublishedCourse);

    } catch (error) {
        console.log("[ADMIN_COURSE_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
