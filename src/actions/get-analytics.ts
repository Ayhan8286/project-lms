import { db } from "@/lib/db";
import { Course, Invoice } from "@prisma/client";

type PurchaseWithCourse = Invoice & {
    course: Course | null;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course ? purchase.course.title : 'Unknown';
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purchase.amount;
    });

    return grouped;
};

export const getAnalytics = async (userId: string) => {
    try {
        const purchases = await db.invoice.findMany({
            where: {
                userId: userId, // Wait, analytics for teacher should show sales OF their courses, not their purchases.
                // We need to find courses OWNED by the teacher, and then find Invoices/Purchases for those courses.
                // But our Schema for Invoice connects User (buyer) and Course.
                // We need to find invoices where course.userId === teacherId.
                course: {
                    userId: userId
                }
            },
            include: {
                course: true,
            },
        });

        const groupedEarnings = groupByCourse(purchases);
        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        return {
            data,
            totalRevenue,
            totalSales,
        };
    } catch (error) {
        console.log("[GET_ANALYTICS]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
        };
    }
};
