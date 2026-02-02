import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, FileText, GraduationCap } from "lucide-react";
import { clerkClient } from "@clerk/nextjs/server";

import { AssignmentForm } from "./_components/AssignmentForm";
import { SubmissionList } from "./_components/SubmissionList";

const AssignmentPage = async ({
    params
}: {
    params: Promise<{ courseId: string; chapterId: string }>
}) => {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId,
        },
    });

    if (!chapter) {
        return redirect("/");
    }

    const assignment = await db.assignment.findUnique({
        where: {
            chapterId: chapterId,
        },
        include: {
            submissions: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });

    // Fetch user details for each submission
    // NOTE: This can be N+1 slow if many submissions. 
    // Optimization: Collect IDs -> Batch fetch. 
    // Clerk might not have batch fetch easily by ID list in public API, usually userList(query).
    // For MVP we just map.

    const submissionsWithUser = assignment ? await Promise.all(
        assignment.submissions.map(async (sub) => {
            let user = null;
            try {
                // If using newer Clerk SDK, it might be clerkClient.users.getUser
                // Or await clerkClient().users...
                // Checking imports...
                // Assuming standard Clerk NextJS pattern.
                // Note: older/newer sdk versions vary. 
                // Using generic try/catch to avoid crash if user deleted.
                const client = await clerkClient();
                const clerkUser = await client.users.getUser(sub.userId);
                if (clerkUser) {
                    user = {
                        fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
                        email: clerkUser.emailAddresses[0]?.emailAddress,
                    }
                }
            } catch (e) {
                console.log(`[USER_FETCH_ERROR] ${sub.userId}`, e);
            }

            return {
                ...sub,
                user,
            }
        })
    ) : [];


    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${courseId}/chapters/${chapterId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to chapter setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Assignment Setup
                            </h1>
                            <span className="text-sm text-slate-700">
                                Set instructions and grade submissions.
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-sky-100 p-2 rounded-full">
                            <FileText className="h-4 w-4 text-sky-700" />
                        </div>
                        <h2 className="text-xl">
                            Instructions
                        </h2>
                    </div>
                    <AssignmentForm
                        initialData={assignment}
                        courseId={courseId}
                        chapterId={chapterId}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-sky-100 p-2 rounded-full">
                            <GraduationCap className="h-4 w-4 text-sky-700" />
                        </div>
                        <h2 className="text-xl">
                            Submissions & Grading
                        </h2>
                    </div>
                    <SubmissionList
                        items={submissionsWithUser}
                        courseId={courseId}
                        chapterId={chapterId}
                    />
                </div>
            </div>
        </div>
    );
}

export default AssignmentPage;
