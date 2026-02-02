"use client";

import { useState } from "react";
import { Assignment, AssignmentSubmission } from "@prisma/client";
import { FileUpload } from "@/components/FileUpload"; // Assuming this exists or we use UploadDropzone
import { Button } from "@/components/ui/button";
import { File, Loader2, CheckCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing"; // Adjust import if needed

interface AssignmentCardProps {
    courseId: string;
    chapterId: string;
    assignment: Assignment & {
        submissions: AssignmentSubmission[];
    };
    currentUserId: string;
}

export const AssignmentCard = ({
    courseId,
    chapterId,
    assignment,
    currentUserId,
}: AssignmentCardProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const submission = assignment.submissions.find(s => s.userId === currentUserId);
    const isSubmitted = !!submission;

    const onSubmit = async (fileUrl: string, fileName: string) => {
        try {
            setIsLoading(true);
            await fetch(`/api/courses/${courseId}/chapters/${chapterId}/assignment/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileUrl, fileName }),
            });
            toast.success("Assignment submitted successfully");
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to submit");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border bg-slate-100 dark:bg-slate-800 rounded-md p-6 mt-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-x-2">
                <File className="h-5 w-5" />
                Assignment
            </h3>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-md border mb-4 text-sm">
                <p className="font-medium mb-1">Instructions:</p>
                <p className="text-muted-foreground">{assignment.instruction}</p>
            </div>

            {isSubmitted && !isEditing ? (
                <div className="flex flex-col gap-y-2">
                    <div className="flex items-center p-3 bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-500 rounded-md text-emerald-700 dark:text-emerald-400">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <p className="text-sm">
                            Submitted: <a href={submission.fileUrl} target="_blank" className="underline font-semibold">{submission.fileName}</a>
                        </p>
                    </div>
                    {typeof submission.grade === 'number' ? (
                        <div className="p-4 bg-slate-200 dark:bg-slate-900 border rounded-md">
                            <p className="font-semibold text-sm mb-1">Grade: {submission.grade}/100</p>
                            {submission.feedback && ((
                                <p className="text-sm text-muted-foreground">Feedback: {submission.feedback}</p>
                            ))}
                        </div>
                    ) : (
                        <div className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md w-fit border border-yellow-300">
                            Pending Review
                        </div>
                    )}
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="w-fit mt-2">
                        Resubmit
                    </Button>
                </div>
            ) : (
                <div>
                    {/* using simple UploadDropzone from uploadthing package directly if custom component not suitable */}
                    <FileUpload
                        endpoint="assignmentSubmission"
                        onChange={(url, name) => {
                            if (url) onSubmit(url, name || "File");
                        }}
                        value=""
                    />
                    {isEditing && (
                        <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="mt-2">
                            Cancel
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
