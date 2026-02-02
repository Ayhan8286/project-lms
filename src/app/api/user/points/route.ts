import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const points = await db.userPoints.findUnique({
            where: { userId }
        });

        return NextResponse.json(points || { xp: 0, level: 1 });

    } catch (error) {
        console.log("[USER_POINTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
