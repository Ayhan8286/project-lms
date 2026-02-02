import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CoursesList } from "@/components/CoursesList";

export default async function WishlistPage() {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const wishlistedCourses = await db.wishlist.findMany({
        where: {
            userId,
        },
        include: {
            course: {
                include: {
                    category: true,
                    chapters: {
                        where: {
                            isPublished: true,
                        },
                        select: {
                            id: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const courses = wishlistedCourses.map(w => w.course);

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-bold">
                        My Wishlist
                    </h1>
                    <p className="text-muted-foreground">
                        Courses you've saved for later
                    </p>
                </div>
            </div>

            <CoursesList items={courses} />

            {courses.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No courses in your wishlist yet.
                </div>
            )}
        </div>
    );
}
