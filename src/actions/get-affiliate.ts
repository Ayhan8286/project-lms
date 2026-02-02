import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const getAffiliate = async () => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        const affiliate = await db.affiliate.findUnique({
            where: {
                userId,
            }
        });

        if (!affiliate) {
            // Auto create if not exists? Or button to join?
            // Let's return null and let UI handle creation
            return null;
        }

        return affiliate;

    } catch (error) {
        console.log("[GET_AFFILIATE]", error);
        return null; // Return null on error
    }
}
