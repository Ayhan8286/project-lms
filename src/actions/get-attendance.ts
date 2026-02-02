import { db } from "@/lib/db";

export const getAttendance = async (userId: string) => {
    try {
        const attendances = await db.attendance.findMany({
            where: {
                userId,
            },
            orderBy: {
                date: "desc",
            }
        });

        const courseIds = [...new Set(attendances.map(a => a.courseId))];
        const chapterIds = [...new Set(attendances.map(a => a.chapterId).filter(Boolean) as string[])];

        const courses = await db.course.findMany({
            where: {
                id: {
                    in: courseIds,
                }
            },
            select: {
                id: true,
                title: true,
            }
        });

        const chapters = await db.chapter.findMany({
            where: {
                id: {
                    in: chapterIds,
                }
            },
            select: {
                id: true,
                title: true,
            }
        });

        const data = attendances.map((item) => {
            const course = courses.find(c => c.id === item.courseId);
            const chapter = chapters.find(c => c.id === item.chapterId);

            return {
                id: item.id,
                date: item.date,
                courseTitle: course?.title || "Unknown Course",
                chapterTitle: chapter?.title || "Live Session",
                status: "Present",
            };
        });

        return data;
    } catch (error) {
        console.log("[GET_ATTENDANCE]", error);
        return [];
    }
}
