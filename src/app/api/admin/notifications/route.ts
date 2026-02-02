import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { title, message, target } = await req.json(); // target: "ALL" | "TEACHERS" | "STUDENTS"

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let targetUserIds: string[] = [];

        if (target === "TEACHERS" || target === "ALL") {
            const teachers = await db.teacherProfile.findMany({ select: { userId: true } });
            targetUserIds.push(...teachers.map(t => t.userId));
        }

        if (target === "STUDENTS" || target === "ALL") {
            // "Students" = Users with at least one purchase (Invoice) or Progress
            // To be safe and capture free enrollments (if any), let's look at Invoice (even free ones should be there if implemented right) 
            // OR unique userIds in UserProgress.

            const studentsWithPurchases = await db.invoice.findMany({
                select: { userId: true },
                distinct: ['userId']
            });

            targetUserIds.push(...studentsWithPurchases.map(s => s.userId));
        }

        // Deduplicate
        const uniqueIds = [...new Set(targetUserIds)];

        if (uniqueIds.length === 0) {
            return new NextResponse("No target users found", { status: 400 });
        }

        // Batch create notifications
        // Prisma createMany is supported on most SQL dbs (SQLite supported in recent versions)
        // Check local provider. It says "sqlite". createMany is NOT supported in SQLite for Prisma < 5.something or specific constraints. 
        // But usually loop is safer for SQLite if createMany fails. 
        // Let's try to use a loop for safety or `db.$transaction`.

        // Actually, createMany IS supported in modern Prisma with SQLite? No, only PostgreSQL, MySQL, SQL Server, CockroachDB, Mongo.
        // SQLite does NOT support createMany.
        // We must loop.

        const notifications = uniqueIds.map(uid =>
            db.notification.create({
                data: {
                    userId: uid,
                    title,
                    message,
                }
            })
        );

        await db.$transaction(notifications);

        return NextResponse.json({ success: true, count: uniqueIds.length });

    } catch (error) {
        console.log("[ADMIN_BROADCAST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
