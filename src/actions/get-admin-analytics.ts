import { db } from "@/lib/db";

export const getAdminAnalytics = async () => {
    try {
        const purchases = await db.invoice.findMany({
            where: {
                status: "PAID"
            },
            include: {
                course: true,
            }
        });

        const totalRevenue = purchases.reduce((acc, purchase) => acc + purchase.amount, 0);
        const totalSales = purchases.length;

        // Group by Course
        const groupedEarnings = purchases.reduce((acc, purchase) => {
            const courseTitle = purchase.course?.title || "Unknown";
            acc[courseTitle] = (acc[courseTitle] || 0) + purchase.amount;
            return acc;
        }, {} as Record<string, number>);

        // For Chart
        const data = Object.entries(groupedEarnings).map(([name, total]) => ({
            name,
            total,
        })).sort((a, b) => b.total - a.total).slice(0, 5); // Top 5 Courses

        return {
            data,
            totalRevenue,
            totalSales,
        }

    } catch (error) {
        console.log("[GET_ADMIN_ANALYTICS]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
        }
    }
}
