"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

const formSchema = z.object({
    content: z.string().min(1, { message: "Comment cannot be empty" }),
});

interface CommentFormProps {
    courseId: string;
    chapterId: string;
}

export const CommentForm = ({ courseId, chapterId }: CommentFormProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            await fetch(`/api/courses/${courseId}/chapters/${chapterId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            toast.success("Comment posted");
            form.reset();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
            <h3 className="font-semibold mb-2 flex items-center gap-x-2">
                <MessageSquare className="h-4 w-4" />
                Ask a Question
            </h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-x-2">
                <Input
                    disabled={isLoading}
                    placeholder="Type your question here..."
                    {...form.register("content")}
                    className="bg-white dark:bg-slate-950"
                />
                <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                    Post
                </Button>
            </form>
        </div>
    );
};
