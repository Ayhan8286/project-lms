"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createAffiliate = async () => {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Generate unique code based on userId sub
        // Simple code: AFF-{last 6 chars of userId}
        const code = `AFF-${userId.slice(-6).toUpperCase()}`;

        const affiliate = await db.affiliate.create({
            data: {
                userId,
                code,
            }
        });

        revalidatePath("/affiliate");
        return affiliate;

    } catch (error) {
        console.log("[CREATE_AFFILIATE]", error);
        return null;
    }
}
