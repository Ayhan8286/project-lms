import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ messageId: string }> }
) {
    try {
        const { userId } = await auth();
        const { messageId } = await params;

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const message = await db.message.findUnique({
            where: {
                id: messageId,
            }
        });

        if (!message) {
            return new NextResponse("Not found", { status: 404 });
        }

        // Soft delete the message to hide the link
        const deletedMessage = await db.message.update({
            where: {
                id: messageId,
            },
            data: {
                deleted: true,
                content: "This live class link has been removed by an admin.",
                fileUrl: null,
            }
        });

        return NextResponse.json(deletedMessage);

    } catch (error) {
        console.log("[ADMIN_LIVE_CLASS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
