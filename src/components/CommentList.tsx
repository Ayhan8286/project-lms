"use client";

import { Comment } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { UserCircle } from "lucide-react";

interface CommentListProps {
    items: Comment[];
}

export const CommentList = ({ items }: CommentListProps) => {
    return (
        <div className="space-y-4 mt-4">
            {items.map((item) => (
                <div key={item.id} className="flex items-start gap-x-3 p-4 border rounded-md shadow-sm">
                    <UserCircle className="h-8 w-8 text-slate-500" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-x-2">
                            <p className="font-semibold text-sm">Student</p> {/* We'd need to fetch user details to show name */}
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                            {item.content}
                        </p>
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                    No matching questions found.
                </div>
            )}
        </div>
    );
};
