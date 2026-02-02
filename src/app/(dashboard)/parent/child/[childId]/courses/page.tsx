import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/CoursesList";

const ChildCoursesPage = async ({
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

    // Fetch courses for the child
    const { completedCourses, coursesInProgress } = await getDashboardCourses(childId);

    return (
        <div className="p-6 space-y-4">
            <div className="mb-6">
                <Link
                    href={`/parent/dashboard`}
                    className="flex items-center text-sm hover:opacity-75 transition mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-x-2">
                    <div className="bg-sky-100 p-2 rounded-full">
                        <BookOpen className="h-6 w-6 text-sky-600" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Course Progress: {childName}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-slate-950 flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-2 font-semibold text-slate-700 dark:text-slate-200">
                        <Clock className="w-4 h-4 text-sky-500" />
                        In Progress
                    </div>
                    <div className="text-2xl font-bold">{coursesInProgress.length}</div>
                </div>
                <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-slate-950 flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-2 font-semibold text-slate-700 dark:text-slate-200">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Completed
                    </div>
                    <div className="text-2xl font-bold">{completedCourses.length}</div>
                </div>
            </div>

            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        </div>
    );
}

export default ChildCoursesPage;
