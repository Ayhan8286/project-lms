"use client";

import { Attachment } from "@prisma/client";
import { File, Loader2 } from "lucide-react";

interface CourseAttachmentsProps {
    attachments: Attachment[];
}

export const CourseAttachments = ({
    attachments
}: CourseAttachmentsProps) => {
    return (
        <div className="flex flex-col gap-y-2">
            {attachments.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                    No resources available
                </p>
            )}
            {attachments.map((attachment) => (
                <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                >
                    <File className="h-4 w-4 mr-2" />
                    <p className="text-xs line-clamp-1">
                        {attachment.name}
                    </p>
                </a>
            ))}
        </div>
    )
}
