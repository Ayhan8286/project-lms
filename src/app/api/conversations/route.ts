import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";

export async function POST(
    req: Request
) {
    try {
        const { userId: currentUser } = await auth();
        const body = await req.json();
        const { userId: otherUser } = body;

        if (!currentUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!otherUser) {
            return new NextResponse("Missing userId", { status: 400 });
        }

        const conversation = await getOrCreateConversation(currentUser, otherUser);

        return NextResponse.json(conversation);

    } catch (error) {
        console.log("[CONVERSATIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
