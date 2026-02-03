"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Question, Answer } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuestionAnswersFormProps {
    initialData: Question & { answers: Answer[] };
    courseId: string;
    chapterId: string;
    questionId: string;
}

const formSchema = z.object({
    text: z.string().min(1, {
        message: "Answer text is required",
    }),
});

export const QuestionAnswersForm = ({
    initialData,
    courseId,
    chapterId,
    questionId,
}: QuestionAnswersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(
                `/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/answers`,
                values
            );
            toast.success("Answer created");
            toggleCreating();
            form.reset();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const onDelete = async (answerId: string) => {
        try {
            setDeletingId(answerId);
            await axios.delete(
                `/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/answers/${answerId}`
            );
            toast.success("Answer deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    };

    const onToggleCorrect = async (answerId: string, isCorrect: boolean) => {
        try {
            setIsUpdating(true);
            await axios.patch(
                `/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}/answers/${answerId}`,
                { isCorrect: !isCorrect }
            );
            toast.success("Answer updated");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Question answers
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an answer
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Paris'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.answers.length && "text-slate-500 italic"
                )}>
                    {!initialData.answers.length && "No answers yet"}
                    <div className="space-y-2">
                        {initialData.answers.map((answer) => (
                            <div
                                key={answer.id}
                                className={cn(
                                    "flex items-center gap-x-2 bg-slate-200 dark:bg-slate-800 border-slate-200 dark:border-slate-700 border text-slate-700 dark:text-slate-300 rounded-md p-3",
                                    answer.isCorrect && "bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300"
                                )}
                            >
                                <span className="flex-1">{answer.text}</span>
                                <Button
                                    onClick={() => onToggleCorrect(answer.id, answer.isCorrect)}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "text-xs",
                                        answer.isCorrect ? "text-sky-600" : "text-slate-500"
                                    )}
                                >
                                    {answer.isCorrect ? "Correct ✓" : "Mark correct"}
                                </Button>
                                <Button
                                    onClick={() => onDelete(answer.id)}
                                    variant="ghost"
                                    size="sm"
                                    disabled={deletingId === answer.id}
                                >
                                    {deletingId === answer.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash className="h-4 w-4 text-red-500" />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
