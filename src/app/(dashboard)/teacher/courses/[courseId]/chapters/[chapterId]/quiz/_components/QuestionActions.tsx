"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal"; // I need to check if this exists or just inline confirm

interface QuestionActionsProps {
    courseId: string;
    chapterId: string;
    questionId: string;
};

export const QuestionActions = ({
    courseId,
    chapterId,
    questionId
}: QuestionActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}`);
            toast.success("Question deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/quiz`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button size="sm" disabled={isLoading} variant="destructive" onClick={onDelete}>
                <Trash className="h-4 w-4" />
            </Button>
        </div>
    )
}
