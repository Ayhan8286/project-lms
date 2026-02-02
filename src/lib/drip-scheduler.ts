import { db } from "@/lib/db";
import { isAfter } from "date-fns";

export const getDripAccess = async (userId: string, chapterId: string) => {
    // 1. Get chapter settings
    const chapter = await db.chapter.findUnique({
        where: { id: chapterId },
        select: {
            // We'd need to add 'daysToUnlock' to schema first, assuming it exists
            // For this sample, we'll pretend it's on the model or use a metadata field
            id: true,
            courseId: true
        }
    });

    if (!chapter) return false;

    // 2. Get enrollment date
    const purchase = await db.invoice.findFirst({
        where: {
            userId,
            courseId: chapter.courseId,
            status: "PAID"
        },
        orderBy: { createdAt: "asc" }
    });

    if (!purchase) return false;

    // Simulated "daysToUnlock" since we didn't add it to schema in the first pass
    // In real app: const unlockDate = addDays(purchase.createdAt, chapter.daysToUnlock)
    const unlockDate = purchase.createdAt;

    return isAfter(new Date(), unlockDate);
};
