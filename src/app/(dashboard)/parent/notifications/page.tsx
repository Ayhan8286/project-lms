import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Bell, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const NotificationsPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const notifications = await db.notification.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-x-2">
                    <div className="bg-sky-100 p-2 rounded-full">
                        <Bell className="h-6 w-6 text-sky-600" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Notifications
                    </h1>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 && (
                    <div className="text-center text-slate-500 py-10 border rounded-lg bg-slate-50 dark:bg-slate-900">
                        No notifications yet.
                    </div>
                )}
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={cn(
                            "flex items-start gap-x-4 p-4 border rounded-lg transition hover:shadow-sm bg-white dark:bg-slate-950",
                            !notification.isRead && "border-sky-200 bg-sky-50 dark:bg-sky-950/20"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-full shrink-0",
                            notification.isRead ? "bg-slate-100" : "bg-sky-100"
                        )}>
                            {notification.isRead ? (
                                <Check className="h-4 w-4 text-slate-500" />
                            ) : (
                                <Bell className="h-4 w-4 text-sky-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className={cn("font-semibold", !notification.isRead && "text-sky-700 dark:text-sky-400")}>
                                {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {format(new Date(notification.createdAt), "PP p")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationsPage;
