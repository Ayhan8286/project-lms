"use client";

import { Bell } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const NotificationButton = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
        } catch {
            console.log("Failed to fetch notifications");
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchNotifications();
        // Polling every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const onMarkRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}`, { method: "PATCH" });
            setNotifications(current =>
                current.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {
            // ignore
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full text-[10px] text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b font-medium">Notifications</div>
                <div className="flex flex-col max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications.
                        </div>
                    )}
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => !notification.isRead && onMarkRead(notification.id)}
                            className={cn(
                                "p-4 border-b last:border-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition",
                                !notification.isRead && "bg-sky-50 dark:bg-sky-900/20"
                            )}
                        >
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-2 text-right">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
