import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export const getChildTeachers = async (parentId: string) => {
    // 1. Get linked children
    const links = await db.parentStudent.findMany({
        where: {
            parentId,
        }
    });

    const childIds = links.map(l => l.studentId);

    if (childIds.length === 0) return [];

    // 2. Get purchased courses for these children
    // We want the Course to get the userId (Teacher)
    const invoices = await db.invoice.findMany({
        where: {
            userId: { in: childIds },
            status: "PAID",
        },
        include: {
            course: true,
        }
    });

    // 3. Extract unique Teachers
    const teacherMap = new Map<string, { teacherId: string; courseKey: string, childId: string }>();

    invoices.forEach(inv => {
        if (inv.course && inv.course.userId) {
            // Key by teacherId to avoid duplicates
            if (!teacherMap.has(inv.course.userId)) {
                teacherMap.set(inv.course.userId, {
                    teacherId: inv.course.userId,
                    courseKey: inv.course.title,
                    childId: inv.userId // Just one child reference for context
                });
            }
        }
    });

    const teachers: any[] = [];
    const client = await clerkClient();

    for (const [teacherId, data] of teacherMap.entries()) {
        try {
            // Get Teacher Details
            const user = await client.users.getUser(teacherId);

            // Check for existing conversation
            const conversation = await db.conversation.findFirst({
                where: {
                    OR: [
                        { memberOneId: parentId, memberTwoId: teacherId },
                        { memberOneId: teacherId, memberTwoId: parentId },
                    ]
                }
            });

            teachers.push({
                teacherId: teacherId,
                name: `${user.firstName} ${user.lastName}`,
                email: user.emailAddresses[0]?.emailAddress,
                imageUrl: user.imageUrl,
                courseName: data.courseKey,
                conversationId: conversation?.id || null,
            });
        } catch (e) {
            console.log(`[GET_CHILD_TEACHERS] Failed to fetch user ${teacherId}`);
        }
    }

    return teachers;
}
