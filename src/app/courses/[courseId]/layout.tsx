import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";
import { CourseSidebar } from "./_components/CourseSidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CourseLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}) {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        }
                    }
                },
                orderBy: {
                    position: "asc",
                }
            },
        },
    });

    if (!course) {
        return redirect("/");
    }

    const progressCount = await getProgress(userId, courseId);

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <div className="p-4 border-b h-full flex items-center bg-white dark:bg-slate-950 shadow-sm">
                    {/* Mobile Toggle would go here if we had one i.e. <MobileSidebar /> */}
                    <Link href="/dashboard" className="flex items-center hover:opacity-75 transition">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back <span className="hidden md:inline ml-1">to Dashboard</span>
                    </Link>
                </div>
            </div>

            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </div>

            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
    );
}
