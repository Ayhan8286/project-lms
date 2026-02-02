import { db } from "@/lib/db";

export const getFilteredNotifications = async (userId: string, filter: "all" | "unread" | "archived") => {
    const whereClause: Record<string, unknown> = { userId };

    if (filter === "unread") {
        whereClause.isRead = false;
    }
    // "archived" would require an 'isArchived' field in schema

    return await db.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" }
    });
};
