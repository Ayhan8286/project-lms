import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        // Check Database
        await db.course.findFirst();

        // Check Memory
        const memoryUsage = process.memoryUsage();

        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            database: "connected",
            memory: {
                rss: Math.round(memoryUsage.rss / 1024 / 1024) + "MB",
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + "MB",
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + "MB",
            }
        });
    } catch (error) {
        return new NextResponse("Unhealthy", { status: 503 });
    }
}
