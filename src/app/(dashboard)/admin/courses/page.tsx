import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Trash2, AlertTriangle, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CourseActions } from "./_components/CourseActions";

const AdminCoursesPage = async () => {
    const { userId } = await auth();

    if (!await isAdmin(userId)) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        include: {
            category: true,
            _count: {
                select: { purchases: true }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Course Audit</h1>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Price</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Sales</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {courses.map((course) => (
                                <tr key={course.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">
                                        <div className="flex flex-col">
                                            <span>{course.title}</span>
                                            <span className="text-xs text-muted-foreground">ID: {course.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {course.category?.name || "Uncategorized"}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {course.price ? formatPrice(course.price) : "Free"}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={course.isPublished ? "default" : "secondary"}>
                                            {course.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {course._count.purchases}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <CourseActions courseId={course.id} isPublished={course.isPublished} />
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

export default AdminCoursesPage;
