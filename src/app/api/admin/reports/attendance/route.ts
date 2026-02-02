import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { format } from "date-fns";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const records = await db.attendance.findMany({
            orderBy: { date: "desc" },
            include: { course: true }
        });

        const csvRows = [
            ["Date", "Student Search ID", "Course", "Status"]
        ];

        records.forEach(rec => {
            csvRows.push([
                format(rec.date, "yyyy-MM-dd"),
                rec.studentId, // Note: This is usually the User ID
                rec.course.title,
                rec.present ? "Present" : "Absent"
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
