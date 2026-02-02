"use client";

import axios from "axios";
import { PlusCircle, Loader2, Trash, CheckCircle, Circle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Answer } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuestionAnswersFormProps {
    initialData: {
        answers: Answer[];
    };
    courseId: string;
    chapterId: string;
    questionId: string;
};

export const QuestionAnswersForm = ({
    initialData,
    courseId,
    chapterId,
    questionId
}: QuestionAnswersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // For editing an answer inline
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const router = useRouter();

    const onCreate = async () => {
        try {
            setIsLoading(true);
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/answers`);
            toast.success("Option added");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async (id: string) => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/answers/${id}`);
            toast.success("Option deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onUpdate = async (id: string, values: Partial<Answer>) => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/answers/${id}`, values);
            toast.success("Option updated");
            setEditingId(null);
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const startEditing = (answer: Answer) => {
        setEditingId(answer.id);
        setEditText(answer.text);
    }

    const saveEdit = (id: string) => {
        onUpdate(id, { text: editText });
    }

    const toggleCorrect = (id: string, isCorrect: boolean) => {
        onUpdate(id, { isCorrect: !isCorrect });
    }

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Answers options
                <Button onClick={onCreate} variant="ghost" disabled={isLoading}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add option
                </Button>
            </div>
            <div className="text-sm mt-2 space-y-2">
                {!initialData.answers.length && (
                    <div className="text-slate-500 italic">No options yet</div>
                )}
                {initialData.answers.map((answer) => (
                    <div
                        key={answer.id}
                        className={cn(
                            "flex items-center gap-x-2 p-2 bg-slate-200 dark:bg-slate-800 border-slate-200 border text-slate-700 rounded-md",
                            answer.isCorrect && "bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
                        )}
                    >
                        <button
                            disabled={isLoading}
                            onClick={() => toggleCorrect(answer.id, answer.isCorrect)}
                            className={cn(
                                "hover:scale-110 transition",
                                isLoading && "opacity-50 cursor-not-allowed"
                            )}
                            title={answer.isCorrect ? "Correct Answer" : "Mark as Correct"}
                        >
                            {answer.isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <Circle className="h-5 w-5 text-slate-500" />
                            )}
                        </button>

                        {editingId === answer.id ? (
                            <div className="flex items-center gap-x-2 w-full">
                                <Input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="h-8"
                                    autoFocus
                                />
                                <Button
                                    size="sm"
                                    onClick={() => saveEdit(answer.id)}
                                    disabled={isLoading}
                                >
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="flex-1 cursor-pointer hover:underline"
                                onClick={() => startEditing(answer)}
                            >
                                {answer.text}
                            </div>
                        )}

                        <div className="ml-auto flex items-center">
                            {(isLoading && editingId !== answer.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin max-w-4" />
                            ) : (
                                <button
                                    onClick={() => onDelete(answer.id)}
                                    className="hover:opacity-75 transition text-red-500"
                                    type="button"
                                    disabled={isLoading}
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-xs text-muted-foreground mt-4">
                Click option text to edit. Click circle to mark as correct.
            </div>
        </div>
    )
}
