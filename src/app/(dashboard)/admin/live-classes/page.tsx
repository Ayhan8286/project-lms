import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { format } from "date-fns";
import { LiveClassActions } from "./_components/LiveClassActions";
import { Video } from "lucide-react";
import { clerkClient } from "@clerk/nextjs/server";

const AdminLiveClassesPage = async () => {
    const { userId } = await auth();

    if (!await isAdmin(userId)) {
        return redirect("/");
    }

    // Find messages containing Jitsi links that are NOT deleted
    const messages = await db.message.findMany({
        where: {
            content: {
                contains: "meet.jit.si"
            },
            deleted: false
        },
        include: {
            conversation: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // Helper to get user names
    const client = await clerkClient();
    const messagesWithUser = await Promise.all(messages.map(async (msg) => {
        let senderName = "Unknown";
        try {
            const user = await client.users.getUser(msg.senderId);
            senderName = `${user.firstName} ${user.lastName}`;
        } catch { }
        return {
            ...msg,
            senderName
        }
    }));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Live Class Audit</h1>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date Started</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Host</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Meeting Link</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {messagesWithUser.length === 0 && (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={4} className="p-4 align-middle text-center text-muted-foreground">
                                        No active live classes found.
                                    </td>
                                </tr>
                            )}
                            {messagesWithUser.map((msg) => (
                                <tr key={msg.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle">
                                        {format(new Date(msg.createdAt), "PP p")}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {msg.senderName}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <a href={msg.content} target="_blank" className="flex items-center text-blue-600 hover:underline">
                                            <Video className="h-4 w-4 mr-2" />
                                            Join Meeting
                                        </a>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <LiveClassActions messageId={msg.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminLiveClassesPage;
