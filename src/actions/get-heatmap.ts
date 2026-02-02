import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { startOfYear, endOfYear, format } from "date-fns";

export const getHeatmap = async () => {
    try {
        const { userId } = await auth();
        if (!userId) return [];

        const progress = await db.userProgress.findMany({
            where: {
                userId,
                updatedAt: {
                    gte: startOfYear(new Date()),
                    lte: endOfYear(new Date())
                }
            },
            select: {
                updatedAt: true
            }
        });

        // Group by day count
        const counts: Record<string, number> = {};

        progress.forEach(p => {
            const date = format(p.updatedAt, "yyyy-MM-dd");
            counts[date] = (counts[date] || 0) + 1;
        });

        return Object.entries(counts).map(([date, count]) => ({
            date,
            count
        }));

    } catch (error) {
        return [];
    }
}
