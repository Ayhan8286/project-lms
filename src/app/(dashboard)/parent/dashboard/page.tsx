import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { User, CalendarCheck, Plus, BookOpen, Award, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const ParentDashboard = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    // Fetch linked students
    const parentStudents = await db.parentStudent.findMany({
        where: {
            parentId: userId,
        },
    });

    const children = await Promise.all(
        parentStudents.map(async (link) => {
            let user = null;
            try {
                const client = await clerkClient();
                const clerkUser = await client.users.getUser(link.studentId);
                if (clerkUser) {
                    user = {
                        id: link.studentId,
                        fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
                        imageUrl: clerkUser.imageUrl,
                        email: clerkUser.emailAddresses[0]?.emailAddress,
                    }
                }
            } catch (e) {
                console.log(`[USER_FETCH] ${link.studentId} failed`);
            }
            return user;
        })
    );

    const validChildren = children.filter((child): child is NonNullable<typeof child> => child !== null);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Parent Dashboard</h1>
                {/* Placeholder for 'Add Child' modal/flow */}
                <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Link Child
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {validChildren.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-10 border rounded-lg bg-slate-50 dark:bg-slate-900">
                        No children linked yet.
                    </div>
                )}
                {validChildren.map((child) => (
                    <div key={child.id} className="border rounded-lg p-6 bg-white dark:bg-slate-950 shadow-sm">
                        <div className="flex items-center gap-x-4 mb-4">
                            {child.imageUrl ? (
                                <img
                                    src={child.imageUrl}
                                    alt="Avatar"
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-slate-500" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{child.fullName}</h3>
                                <p className="text-sm text-muted-foreground">{child.email}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link href={`/parent/child/${child.id}/attendance`}>
                                <Button className="w-full" variant="outline">
                                    <CalendarCheck className="h-4 w-4 mr-2" />
                                    View Attendance
                                </Button>
                            </Link>
                            <Link href={`/parent/child/${child.id}/courses`}>
                                <Button className="w-full" variant="outline">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    View Progress
                                </Button>
                            </Link>
                            <Link href={`/parent/child/${child.id}/grades`}>
                                <Button className="w-full" variant="outline">
                                    <Award className="h-4 w-4 mr-2" />
                                    View Grades
                                </Button>
                            </Link>
                            <Link href={`/parent/child/${child.id}/fees`}>
                                <Button className="w-full" variant="outline">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    View Fees
                                </Button>
                            </Link>
                            {/* Future: View Grades, etc. */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ParentDashboard;
