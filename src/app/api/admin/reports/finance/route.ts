import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { format } from "date-fns";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const invoices = await db.invoice.findMany({
            orderBy: { createdAt: "desc" },
            include: { course: true }
        });

        const csvRows = [
            ["Invoice ID", "Date", "User ID", "Course", "Amount", "Status", "Paid At"]
        ];

        invoices.forEach(inv => {
            csvRows.push([
                inv.id,
                format(inv.createdAt, "yyyy-MM-dd HH:mm:ss"),
                inv.userId,
                inv.course?.title || "Unknown",
                inv.amount.toString(),
                inv.status,
                inv.paidAt ? format(inv.paidAt, "yyyy-MM-dd HH:mm:ss") : ""
            ]);
        });

        const csvContent = csvRows.map(e => e.join(",")).join("\n");

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": 'attachment; filename="finance-report.csv"',
            }
        });

    } catch (error) {
        console.log("[REPORT_FINANCE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
