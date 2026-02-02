import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { content, conversationId, fileUrl } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        if (!content && !fileUrl) {
            return new NextResponse("Empty message", { status: 400 });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { memberOneId: userId },
                    { memberTwoId: userId },
                ]
            }
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        const message = await db.message.create({
            data: {
                content: content || "", // handle file-only messages
                fileUrl,
                conversationId: conversationId,
                senderId: userId,
            }
        });

        return NextResponse.json(message);

    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        const { searchParams } = new URL(req.url); // Use standard URL obj
        const conversationId = searchParams.get("conversationId");

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID missing", { status: 400 });
        }

        const messages = await db.message.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: "asc", // or desc depending on UI
            }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.log("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
