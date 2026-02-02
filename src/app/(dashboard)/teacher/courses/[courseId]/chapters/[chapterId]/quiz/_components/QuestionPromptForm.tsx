"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuestionPromptFormProps {
    initialData: {
        prompt: string;
    };
    courseId: string;
    chapterId: string;
    questionId: string;
};

const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Question prompt is required",
    }),
});

export const QuestionPromptForm = ({
    initialData,
    courseId,
    chapterId,
    questionId
}: QuestionPromptFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/quiz/questions/${questionId}`, values);
            toast.success("Question updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Question prompt
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit prompt
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2">
                    {initialData.prompt}
                </p>
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <Input
                            disabled={isSubmitting}
                            placeholder="e.g. 'What is the capital of France?'"
                            {...form.register("prompt")}
                        />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
