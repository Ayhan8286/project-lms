import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        const { studentId, date } = await req.json(); // Admin/Teacher marking for a student

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

        // Create attendance record
        // We might want to check if one exists for this day already to prevent dupes?
        // For MVP, just create. 
        // Or finding existing for "today" logic.

        const attendance = await db.attendance.create({
            data: {
                courseId: courseId,
                userId: studentId,
                date: date ? new Date(date) : new Date(),
            }
        });

        // Notify Parents
        const parentLinks = await db.parentStudent.findMany({
            where: {
                studentId: studentId,
            }
        });

        for (const link of parentLinks) {
            await db.notification.create({
                data: {
                    userId: link.parentId,
                    title: "Attendance Update",
                    message: `Attendance marked for your child in ${courseOwner.title}`,
                }
            });
        }

        return NextResponse.json(attendance);

    } catch (error) {
        console.log("[ATTENDANCE_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
