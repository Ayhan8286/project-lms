import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { WishlistButton } from "@/components/WishlistButton";
import { EnrollCard } from "@/components/EnrollCard";
import Image from "next/image";

export default async function CoursePage({
    params
}: {
    params: Promise<{ courseId: string }>
}) {
    const { courseId } = await params;

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc",
                }
            },
            reviews: {
                orderBy: {
                    createdAt: "desc",
                }
            }
        }
    });

    if (!course) {
        return redirect("/");
    }

    // Check if purchased
    // For now, we check if there's any PAID invoice for this course & user
    // But since `auth()` is async need to await it.
    const { userId } = await auth();

    let isPurchased = false;
    let wishlist = null;
    let teacherProfile = null;
    if (userId) {
        const purchase = await db.invoice.findFirst({
            where: {
                userId,
                courseId: course.id,
                status: "PAID"
            }
        });
        isPurchased = !!purchase;

        wishlist = await db.wishlist.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: course.id
                }
            }
        });

        if (course) {
            teacherProfile = await db.teacherProfile.findUnique({
                where: {
                    userId: course.userId
                }
            });
        }
    } else {
        // Even if not logged in, we might want to show teacher profile? 
        // Yes, but course.userId is needed.
        teacherProfile = await db.teacherProfile.findUnique({
            where: {
                userId: course.userId
            }
        });
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Course Thumbnail */}
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                    {course.imageUrl ? (
                        <Image
                            src={course.imageUrl}
                            alt={course.title}
                            className="object-cover"
                            fill
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground bg-slate-100 dark:bg-slate-900">
                            No Image
                        </div>
                    )}
                </div>

                {/* Course Info & Enroll */}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-4">
                    {course.description || "No description provided."}
                </p>

                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between">
                    <div className="font-medium">
                        {course.price ? `PKR ${course.price.toLocaleString()}` : "Free"}
                    </div>

                    {isPurchased || course.price === 0 ? (
                        <a
                            href={`/courses/${course.id}/chapters/${course.chapters[0]?.id}`}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
                        >
                            Continue Learning
                        </a>
                    ) : (
                        <EnrollCard
                            course={course}
                            isPurchased={isPurchased}
                        />
                    )}
                </div>
            </div>

            {/* Chapters List */}
            <div className="border rounded-lg overflow-hidden mb-8">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b font-medium">
                    Course Content
                </div>
                <div className="flex flex-col divide-y">
                    {course.chapters.map((chapter) => (
                        <div key={chapter.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                            <span className="flex items-center gap-x-2">
                                <span className={`p-1 rounded-full ${chapter.isFree || isPurchased ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                    {chapter.isFree || isPurchased ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-circle"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    )}
                                </span>
                                {chapter.title}
                            </span>
                            {chapter.isFree && !isPurchased && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full">
                                    Free Preview
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Teacher Profile Section */}
            {teacherProfile && (
                <div className="mb-8 p-6 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="text-xl font-bold mb-4">About the Instructor</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap mb-4">{teacherProfile.bio}</p>
                    <div className="flex gap-x-4">
                        {teacherProfile.websiteUrl && (
                            <a href={teacherProfile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Website</a>
                        )}
                        {teacherProfile.twitterUrl && (
                            <a href={teacherProfile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Twitter</a>
                        )}
                        {teacherProfile.linkedinUrl && (
                            <a href={teacherProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">LinkedIn</a>
                        )}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="mt-8">
                <ReviewForm courseId={course.id} />
                <ReviewList reviews={course.reviews || []} />
            </div>
        </div>
    );
}
