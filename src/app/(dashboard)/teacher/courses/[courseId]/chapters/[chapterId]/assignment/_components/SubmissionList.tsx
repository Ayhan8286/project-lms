"use client";

import { AssignmentSubmission } from "@prisma/client";
import { useState } from "react";
import { File, ExternalLink, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// Assuming Textarea exists or I use generic textarea. 
// I'll check if ui/textarea exists, if not use standard.
// I'll use standard to be safe or Input for now. 
// Actually feedback can be long. 

interface SubmissionListProps {
    items: (AssignmentSubmission & {
        user?: {
            fullName: string | null;
            email: string | null;
        }
    })[];
    courseId: string;
    chapterId: string;
};

export const SubmissionList = ({
    items,
    courseId,
    chapterId
}: SubmissionListProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onGrade = async (id: string, grade: number, feedback: string) => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assignment/submissions/${id}`, {
                grade,
                feedback
            });
            toast.success("Graded successfully");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">
                Student Submissions ({items.length})
            </h2>
            {items.length === 0 && (
                <div className="text-slate-500 italic text-sm">
                    No submissions yet.
                </div>
            )}
            <div className="space-y-4">
                {items.map((submission) => (
                    <SubmissionItem
                        key={submission.id}
                        submission={submission}
                        onSave={onGrade}
                        disabled={isLoading}
                    />
                ))}
            </div>
        </div>
    )
}

const SubmissionItem = ({
    submission,
    onSave,
    disabled
}: {
    submission: AssignmentSubmission & { user?: { fullName: string | null; email: string | null } };
    onSave: (id: string, grade: number, feedback: string) => Promise<void>;
    disabled: boolean;
}) => {
    const [grade, setGrade] = useState(submission.grade || "");
    const [feedback, setFeedback] = useState(submission.feedback || "");
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        await onSave(submission.id, Number(grade), feedback);
        setIsEditing(false);
    }

    return (
        <div className="border bg-white dark:bg-slate-900 rounded-md p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-sm">
                        {submission.user?.fullName || "Student"}
                        <span className="text-xs text-muted-foreground ml-2 font-normal">
                            ({submission.user?.email || "No email"})
                        </span>
                    </h3>
                    <div className="flex items-center mt-2 text-sky-700">
                        <File className="h-4 w-4 mr-2" />
                        <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline hover:text-sky-600 line-clamp-1 break-all"
                        >
                            {submission.fileName || "View Submission"}
                        </a>
                        <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto min-w-[300px]">
                    <div className="flex gap-2">
                        <div className="w-24">
                            <label className="text-xs font-medium text-slate-500">Grade (0-100)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                disabled={disabled}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-medium text-slate-500">Feedback</label>
                            <Input
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Good job..."
                                disabled={disabled}
                            />
                        </div>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={disabled}
                    >
                        Save Grade
                    </Button>
                </div>
            </div>
        </div>
    )
}
