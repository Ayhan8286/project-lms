"use client";

import * as z from "zod";
import axios from "axios";
import { PlusCircle, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Question, Answer } from "@prisma/client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizQuestionsFormProps {
    initialData: {
        questions: (Question & { answers: Answer[] })[];
    };
    courseId: string;
    chapterId: string;
    quizId: string;
};

export const QuizQuestionsForm = ({
    initialData,
    courseId,
    chapterId,
    quizId
}: QuizQuestionsFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions`, {});
            toast.success("Question created");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Quiz questions
                <Button onClick={onSubmit} variant="ghost" disabled={isLoading}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add a question
                </Button>
            </div>
            <div className="text-sm mt-2">
                {!initialData.questions.length && (
                    <div className="text-slate-500 italic">No questions yet</div>
                )}
                {initialData.questions.length > 0 && (
                    <div className="space-y-2">
                        {initialData.questions.map((question, index) => (
                            <div
                                key={question.id}
                                className={cn(
                                    "flex items-center justify-between p-3 bg-slate-200 dark:bg-slate-800 border-slate-200 border text-slate-700 rounded-md",
                                    !question.answers.some(a => a.isCorrect) && "border-l-4 border-l-yellow-500" // Warn if no correct answer
                                )}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        Q{index + 1}: {question.prompt}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {question.answers.length} options
                                        {!question.answers.some(a => a.isCorrect) && " (No correct answer set!)"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-x-2">
                                    <Link href={`/teacher/courses/${courseId}/chapters/${chapterId}/quiz/questions/${question.id}`}>
                                        <Pencil className="h-4 w-4 cursor-pointer hover:opacity-75 transition" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
