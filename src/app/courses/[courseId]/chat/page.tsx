import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatInterface } from "./_components/ChatInterface";

interface ChatPageProps {
    params: Promise<{
        courseId: string;
    }>;
}

const ChatPage = async ({ params }: ChatPageProps) => {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
    });

    if (!course) {
        return redirect("/");
    }

    // Identify the other user (Teacher)
    const otherUserId = course.userId;

    if (userId === otherUserId) {
        // Teacher viewing their own course chat? 
        // For now, redirect or show message. 
        // Ideally teacher sees list of students.
        // Let's just return a placeholder for safety.
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Instructor View</h1>
                <p>Chat management is available in the Teacher Dashboard.</p>
            </div>
        );
    }

    const conversation = await getOrCreateConversation(userId, otherUserId);

    if (!conversation) {
        return (
            <div className="flex flex-col items-center justify-center p-6 h-full text-muted-foreground">
                <p>Could not initialize conversation.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Chat with Instructor</h1>
            <ChatInterface
                currentUserId={userId}
                conversationId={conversation.id}
                initialMessages={conversation.messages}
                otherUserName="Instructor"
            />
        </div>
    );
}

export default ChatPage;
