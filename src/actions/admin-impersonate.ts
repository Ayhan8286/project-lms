"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const impersonateUser = async (targetUserId: string) => {
    try {
        const { userId } = await auth();

        // Check if current user is admin
        // Simplified check: checking for a specific ID or permission
        // In real app, check db.permission or clerk metadata
        const isAdmin = userId === process.env.ADMIN_USER_ID;

        if (!isAdmin) {
            throw new Error("Unauthorized");
        }

        // In Clerk, real impersonation requires using their API to generate a session token
        // For this "internal logic" version, we might just return a "view-as" cookie
        // that our middleware respects.

        return { success: true, redirectUrl: `/?impersonate=${targetUserId}` };

    } catch (error) {
        console.log("[IMPERSONATE]", error);
        return { error: "Failed to impersonate" };
    }
};
