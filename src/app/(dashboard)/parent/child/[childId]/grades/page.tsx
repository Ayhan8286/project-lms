import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, Award, FileText, CheckCircle2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const ChildGradesPage = async ({
    params
}: {
    params: Promise<{ childId: string }>
}) => {
    const { userId } = await auth();
    const { childId } = await params;

    if (!userId) {
        return redirect("/");
    }

    // Verify parent
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

    // Fetch Quiz Scores (UserProgress)
    // We need to fetch progress that has a score, along with Course title.
    const quizResults = await db.userProgress.findMany({
        where: {
            userId: childId,
            score: {
                not: null, // Only where score exists (assuming score is stored in UserProgress as planned/schema check pending)
            }
        },
        include: {
            chapter: {
                include: {
                    course: {
                        select: { title: true }
                    }
                }
            }
        },
        orderBy: {
            updatedAt: "desc"
        }
    });

    // Fetch Assignment Grades
    const assignmentResults = await db.assignmentSubmission.findMany({
        where: {
            userId: childId,
            grade: {
                not: null,
            }
        },
        include: {
            assignment: {
                include: {
                    chapter: {
                        include: {
                            course: {
                                select: { title: true }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            updatedAt: "desc"
        }
    });


    // Combine or List separately? 
    // Let's have two sections: Quizzes and Assignments

    return (
        <div className="p-6 space-y-8">
            <div className="mb-6">
                <Link
                    href={`/parent/dashboard`}
                    className="flex items-center text-sm hover:opacity-75 transition mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-x-2">
                    <div className="bg-yellow-100 p-2 rounded-full">
                        <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Grades & Reports: {childName}
                    </h1>
                </div>
            </div>

            {/* QUIZZES */}
            <div className="border rounded-lg p-6 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-x-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <h2 className="text-xl font-semibold">Quiz Results</h2>
                </div>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Course</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Chapter</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Score</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {quizResults.length === 0 && (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={3} className="p-4 align-middle text-center text-muted-foreground">
                                        No quiz attempts recorded.
                                    </td>
                                </tr>
                            )}
                            {quizResults.map((res: any) => (
                                <tr key={res.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{res.chapter.course.title}</td>
                                    <td className="p-4 align-middle">{res.chapter.title}</td>
                                    <td className="p-4 align-middle">
                                        <span className={res.score >= 50 ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>
                                            {res.score}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ASSIGNMENTS */}
            <div className="border rounded-lg p-6 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-x-2 mb-4">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    <h2 className="text-xl font-semibold">Assignment Grades</h2>
                </div>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Course</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Assignment</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {assignmentResults.length === 0 && (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={3} className="p-4 align-middle text-center text-muted-foreground">
                                        No assignment grades recorded.
                                    </td>
                                </tr>
                            )}
                            {assignmentResults.map((res) => (
                                <tr key={res.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{res.assignment.chapter.course.title}</td>
                                    <td className="p-4 align-middle">{res.assignment.title || "Untitled Assignment"}</td>
                                    <td className="p-4 align-middle">
                                        <span className={(res.grade || 0) >= 50 ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>
                                            {res.grade}/100
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

export default ChildGradesPage;
