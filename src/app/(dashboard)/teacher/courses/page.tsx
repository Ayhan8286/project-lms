import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil } from "lucide-react";

const CoursesPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Courses</h1>
                <Link href="/teacher/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Course
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Created</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No courses found. Create your first one!
                                </td>
                            </tr>
                        )}
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td className="px-6 py-4 font-medium">
                                    {course.title}
                                </td>
                                <td className="px-6 py-4">
                                    {course.price ? `PKR ${course.price}` : "Free"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>
                                        {course.isPublished ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {course.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/teacher/courses/${course.id}`}>
                                        <Button variant="ghost" size="sm">
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CoursesPage;
