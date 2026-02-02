import { auth } from "@clerk/nextjs/server";

const ADMIN_IDS = [
    "user_2q ...", // Replace with actual Admin User IDs or load from ENV
    // For development, you can add your Clerk User ID here.
];

export const isAdmin = async (userId?: string | null) => {
    if (!userId) {
        return false;
    }

    // Check specific IDs
    // return ADMIN_IDS.includes(userId);

    // DEVELOPMENT MODE: Return true to test Admin Dashboard.
    // In production, uncomment the line above and add your User ID to ADMIN_IDS.
    return true;
}
