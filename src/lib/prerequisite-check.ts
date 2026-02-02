import { db } from "@/lib/db";

export const checkPrerequisites = async (userId: string, courseId: string) => {
    const course = await db.course.findUnique({
        where: { id: courseId },
        select: { prerequisiteId: true }
    });

    if (!course?.prerequisiteId) return true;

    // Check if prerequisite is completed (has certificate)
    const certificate = await db.certificate.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.prerequisiteId
            }
        }
    });

    return !!certificate;
};
