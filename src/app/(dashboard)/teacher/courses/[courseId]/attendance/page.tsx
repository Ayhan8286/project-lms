import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, User, CheckCircle } from "lucide-react";

import { AttendanceButton } from "./_components/AttendanceButton";

const AttendancePage = async ({
    params
}: {
    params: Promise<{ courseId: string }>
}) => {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId: userId,
        },
    });

    if (!course) {
        return redirect("/");
    }

    // Fetch enrolled students via "PAID" Invoices
    const enrolledIds = await db.invoice.findMany({
        where: {
            courseId: courseId,
            status: "PAID",
        },
        select: {
            userId: true,
        }
    });

    // Unique user IDs
    const studentIds = Array.from(new Set(enrolledIds.map(inv => inv.userId)));

    // Fetch users from Clerk
    const students = await Promise.all(
        studentIds.map(async (studentId) => {
            let user = null;
            try {
                const client = await clerkClient();
                const clerkUser = await client.users.getUser(studentId);
                if (clerkUser) {
                    user = {
                        id: studentId,
                        fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
                        email: clerkUser.emailAddresses[0]?.emailAddress,
                        imageUrl: clerkUser.imageUrl,
                    }
                }
            } catch (e) {
                console.log(`[USER_FETCH] ${studentId} failed`, e);
            }
            return user;
        })
    );

    const validStudents = students.filter((student): student is NonNullable<typeof student> => student !== null);

    // Fetch attendance stats for this course (This could be expensive, aggregating)
    // For now, let's just show a list and a button to "Mark Present Today".

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to course setup
                    </Link>
                    <h1 className="text-2xl font-bold">
                        Attendance Management
                    </h1>
                    <p className="text-sm text-slate-500">
                        {validStudents.length} Students Enrolled
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {validStudents.length === 0 && (
                    <div className="text-center text-slate-500 py-10 border rounded-lg bg-slate-50 dark:bg-slate-900">
                        No students enrolled in this course yet.
                    </div>
                )}
                {validStudents.map((student) => (
                    <div key={student.id} className="border p-4 rounded-lg flex items-center justify-between bg-white dark:bg-slate-950 shadow-sm">
                        <div className="flex items-center gap-x-4">
                            {student.imageUrl ? (
                                <img
                                    src={student.imageUrl}
                                    alt="Avatar"
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-slate-500" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{student.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                        </div>
                        <AttendanceButton
                            courseId={courseId}
                            studentId={student.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AttendancePage;
