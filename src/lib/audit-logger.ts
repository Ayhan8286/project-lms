import { db } from "@/lib/db";

export enum ACTION {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    VIEW = "VIEW"
}

export const logSystemEvent = async (
    userId: string,
    action: ACTION,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, unknown>
) => {
    try {
        await db.systemLog.create({
            data: {
                userId,
                action,
                entityType,
                entityId,
                metadata: metadata ? JSON.stringify(metadata) : undefined
            }
        });
    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error);
    }
};
