import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { format } from "date-fns";

const ChildAttendancePage = async ({
    params
}: {
    params: Promise<{ childId: string }>
}) => {
    const { userId } = await auth();
    const { childId } = await params;

    if (!userId) {
        return redirect("/");
    }

    // Verify parent has access to this child
    const isParent = await db.parentStudent.findUnique({
        where: {
            parentId_studentId: {
                parentId: userId,
                studentId: childId,
            }
        }
    });

    // For MVP validation/testing without seeding, maybe relax this?
    // Un-commenting for strictness:
    if (!isParent) {
        return redirect("/");
    }

    // Fetch child details
    let childName = "Child";
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(childId);
        if (user) {
            childName = `${user.firstName} ${user.lastName}`;
        }
    } catch { }

    // Fetch attendance records for this child
    const attendance = await db.attendance.findMany({
        where: {
            userId: childId,
        },
        include: {
            // Include Course details if possible. 
            // Prisma schema has `courseId` but no relation defined in `Attendance` model to `Course`?
            // Let's check Schema...
            // `courseId String` exists. But `@relation` likely missing in Schema view I recalled.
            // If missing, I can't `include: { course: true }`.
            // I'll assume I need to fetch courses manually or update schema.
            // Let's check schema again or just fetch courses separately.
        },
        orderBy: {
            date: "desc",
        }
    });

    // Manual Fetching of Course Names if Relation is missing
    const courseIds = Array.from(new Set(attendance.map(a => a.courseId)));
    const courses = await db.course.findMany({
        where: {
            id: { in: courseIds }
        }
    });
    const courseMap = new Map(courses.map(c => [c.id, c.title]));

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={`/parent/dashboard`}
                    className="flex items-center text-sm hover:opacity-75 transition mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-x-2">
                    <div className="bg-orange-100 p-2 rounded-full">
                        <CalendarCheck className="h-6 w-6 text-orange-600" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Attendance: {childName}
                    </h1>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Course</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {attendance.length === 0 && (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={3} className="p-4 align-middle text-center text-muted-foreground">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                            {attendance.map((record) => (
                                <tr key={record.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">
                                        {format(new Date(record.date), "PPP")}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {courseMap.get(record.courseId) || "Unknown Course"}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-500 text-emerald-50 hover:bg-emerald-500/80">
                                            Present
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ChildAttendancePage;
