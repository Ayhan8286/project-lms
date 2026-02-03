import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { format } from "date-fns";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const records = await db.attendance.findMany({
            orderBy: { date: "desc" },
        });

        // Fetch course details separately
        const courseIds = [...new Set(records.map(r => r.courseId))];
        const courses = await db.course.findMany({
            where: { id: { in: courseIds } },
            select: { id: true, title: true }
        });
        const courseMap = new Map(courses.map(c => [c.id, c.title]));

        const csvRows = [
            ["Date", "Student ID", "Course", "Status"]
        ];

        records.forEach(rec => {
            csvRows.push([
                format(rec.date, "yyyy-MM-dd"),
                rec.userId,
                courseMap.get(rec.courseId) || "Unknown Course",
                "Present" // Attendance records indicate presence
            ]);
        });

        const csvContent = csvRows.map(e => e.join(",")).join("\n");

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="attendance-report.csv"',
            }
        });

    } catch (error) {
        console.log("[REPORT_ATTENDANCE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
