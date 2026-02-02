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

        // Fetch Quiz Progress
        const quizResults = await db.userProgress.findMany({
            where: { isCompleted: true },
            include: { chapter: { include: { course: true } } }
        });

        const csvRows = [
            ["Type", "Date", "User ID", "Course", "Item Title", "Score/Result"]
        ];

        quizResults.forEach(res => {
            csvRows.push([
                "Quiz",
                format(res.updatedAt, "yyyy-MM-dd"),
                res.userId,
                res.chapter.course.title,
                res.chapter.title,
                "Completed" // Start just tracks completion for now, we'd need a Score field in UserProgress for actual marks if we had it. 
                // Wait, UserProgress just tracks 'isCompleted'. 
                // Do we have actual Quiz submissions?
                // The Schema for Quiz had Questions/Answers, but do we store student answers?
                // Looking at UserProgress, it seems boolean.
                // Let's check AssignmentSubmission for grades.
            ]);
        });

        const assignments = await db.assignmentSubmission.findMany({
            include: { assignment: { include: { course: true } } }
        });

        assignments.forEach(sub => {
            csvRows.push([
                "Assignment",
                format(sub.createdAt, "yyyy-MM-dd"),
                sub.userId,
                sub.assignment.course.title,
                sub.assignment.title,
                sub.grade ? sub.grade.toString() : "Pending"
            ]);
        });

        const csvContent = csvRows.map(e => e.join(",")).join("\n");

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="grades-report.csv"',
            }
        });

    } catch (error) {
        console.log("[REPORT_GRADES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
