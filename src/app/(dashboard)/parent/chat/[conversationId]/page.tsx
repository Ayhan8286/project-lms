import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatInterface } from "@/app/courses/[courseId]/chat/_components/ChatInterface"; // Reusing this

import { clerkClient } from "@clerk/nextjs/server";

interface ConversationPageProps {
    params: Promise<{
        conversationId: string;
    }>;
}

const ConversationPage = async ({
    params
}: ConversationPageProps) => {
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

    if (!conversation || (conversation.memberOneId !== userId && conversation.memberTwoId !== userId)) {
        return redirect("/");
    }

    const { memberOneId, memberTwoId } = conversation;
    const otherMemberId = memberOneId === userId ? memberTwoId : memberOneId;

    let otherMemberName = "Teacher";
    let otherMemberImageUrl = "";
    try {
        const client = await clerkClient();
        const otherUser = await client.users.getUser(otherMemberId);
        otherMemberName = `${otherUser.firstName} ${otherUser.lastName}`;
        otherMemberImageUrl = otherUser.imageUrl;
    } catch { }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950">
            {/* We reuse ChatInterface. It usually takes a `courseId` for socket/api endpoints. 
                We might need to adjust it if it relies on course-specific routes.
                Checking ChatInterface props...
                It likely takes `apiUrl`, `socketUrl`, `socketQuery`.
                We used it in `TeacherChatPage` too. Let's see how `TeacherConversationPage` used it.
             */}
            <ChatInterface
                conversationId={conversation.id}
                currentUserId={userId}
                initialMessages={conversation.messages}
                otherUserName={otherMemberName}
            />
        </div>
    );
}

export default ConversationPage;
