import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { ChatInterface } from "@/app/courses/[courseId]/chat/_components/ChatInterface"; // Reuse existing component

const TeacherConversationPage = async ({
    params
}: {
    params: Promise<{ conversationId: string }>
}) => {
    const { userId } = await auth();
    const { conversationId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const conversation = await db.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!conversation) {
        return redirect("/teacher/chat");
    }

    // Verify user is participant
    if (conversation.memberOneId !== userId && conversation.memberTwoId !== userId) {
        return redirect("/");
    }

    const otherUserId = conversation.memberOneId === userId
        ? conversation.memberTwoId
        : conversation.memberOneId;

    let otherUserName = "Student";
    try {
        const client = await clerkClient();
        const otherUser = await client.users.getUser(otherUserId);
        if (otherUser) {
            otherUserName = `${otherUser.firstName} ${otherUser.lastName}`;
        }
    } catch { }

    return (
        <div className="p-6 h-full flex flex-col">
            <h1 className="text-xl font-bold mb-4">Chat with {otherUserName}</h1>
            <div className="flex-1">
                <ChatInterface
                    currentUserId={userId}
                    conversationId={conversation.id}
                    initialMessages={conversation.messages}
                    otherUserName={otherUserName}
                // Note: ChatInterface might expect specific props, I checked it earlier.
                />
            </div>
        </div>
    );
}

export default TeacherConversationPage;
