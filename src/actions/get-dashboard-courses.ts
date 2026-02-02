import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

type ChapterWithProgress = Chapter & {
    userProgress: { isCompleted: boolean; userId: string }[];
};

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: ChapterWithProgress[];
    progress: number | null;
};

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
    totalCompletedChapters: number;
};

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                OR: [
                    {
                        chapters: {
                            some: {
                                userProgress: {
                                    some: {
                                        userId: userId
                                    }
                                }
                            }
                        }
                    },
                    {
                        purchases: {
                            some: {
                                userId: userId,
                                status: "PAID",
                            }
                        }
                    }
                ]
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    orderBy: {
                        position: "asc",
                    },
                    include: {
                        userProgress: { // We need this to calculate percentage
                            where: {
                                userId: userId,
                            }
                        }
                    }
                }
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = courses.map((course) => {
            const publishedChapters = course.chapters;
            const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

            const validCompletedChapters = publishedChapters.filter((chapter) =>
                chapter.userProgress.some((progress) =>
                    progress.userId === userId &&
                    progress.isCompleted
                )
            );

            const progress = publishedChapterIds.length === 0 ? 0 : (validCompletedChapters.length / publishedChapterIds.length) * 100;

            return {
                ...course,
                progress: progress,
            };
        });

        const completedCourses = coursesWithProgress.filter((course) => course.progress === 100);
        const coursesInProgress = coursesWithProgress.filter((course) => (course.progress ?? 0) < 100);

        // Count total completed chapters across all courses
        const totalCompletedChapters = coursesWithProgress.reduce((acc, course) => {
            const completedCount = course.chapters.filter((chapter) =>
                chapter.userProgress.some((progress) => progress.isCompleted && progress.userId === userId)
            ).length;
            return acc + completedCount;
        }, 0);

        return {
            completedCourses,
            coursesInProgress,
            totalCompletedChapters,
        };

    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
            totalCompletedChapters: 0,
        }
    }
}
