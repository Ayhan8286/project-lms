import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ notificationId: string }> }
) {
    try {
        const { userId } = await auth();
        const { notificationId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const notification = await db.notification.update({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
            }
        });

        return NextResponse.json(notification);

    } catch (error) {
        console.log("[NOTIFICATION_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
