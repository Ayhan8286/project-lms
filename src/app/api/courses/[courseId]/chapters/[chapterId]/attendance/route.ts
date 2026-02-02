import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if already attended today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingAttendance = await db.attendance.findFirst({
            where: {
                userId,
                chapterId,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            }
        });

        if (existingAttendance) {
            return new NextResponse("Already recorded", { status: 200 });
        }

        const attendance = await db.attendance.create({
            data: {
                userId,
                courseId,
                chapterId,
            }
        });

        return NextResponse.json(attendance);
    } catch (error) {
        console.log("[ATTENDANCE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
