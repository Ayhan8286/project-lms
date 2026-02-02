import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { User, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const TeacherChatPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    // Find all conversations where user is memberOne or memberTwo
    const conversations = await db.conversation.findMany({
        where: {
            OR: [
                { memberOneId: userId },
                { memberTwoId: userId },
            ]
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            }
        },
        orderBy: {
            updatedAt: "desc",
        }
    });

    // Populate other user details
    const conversationsWithUser = await Promise.all(
        conversations.map(async (conversation) => {
            const otherUserId = conversation.memberOneId === userId
                ? conversation.memberTwoId
                : conversation.memberOneId;

            let otherUser = null;
            try {
                const client = await clerkClient();
                const clerkUser = await client.users.getUser(otherUserId);
                if (clerkUser) {
                    otherUser = {
                        fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
                        imageUrl: clerkUser.imageUrl,
                    }
                }
            } catch (e) {
                console.log(`[USER_FETCH] ${otherUserId} failed`);
            }

            return {
                ...conversation,
                otherUser,
            };
        })
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            <div className="grid gap-4">
                {conversationsWithUser.length === 0 && (
                    <div className="text-center text-slate-500 py-10">
                        No conversations yet.
                    </div>
                )}
                {conversationsWithUser.map((conversation) => (
                    <Link
                        key={conversation.id}
                        href={`/teacher/chat/${conversation.id}`}
                        className="block"
                    >
                        <div className="border rounded-lg p-4 hover:shadow-md transition flex items-center justify-between bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-x-4">
                                {conversation.otherUser?.imageUrl ? (
                                    <img
                                        src={conversation.otherUser.imageUrl}
                                        alt="Avatar"
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                                        <User className="h-6 w-6 text-slate-500" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {conversation.otherUser?.fullName || "Unknown User"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate max-w-md">
                                        {conversation.messages[0]?.content || "No messages yet"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {conversation.messages[0]?.createdAt &&
                                    format(new Date(conversation.messages[0].createdAt), "PPp")
                                }
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default TeacherChatPage;
