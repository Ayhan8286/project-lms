"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChaptersFormProps {
    initialData: {
        chapters: Chapter[];
    };
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1),
});

export const ChaptersForm = ({
    initialData,
    courseId
}: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter created");
            toggleCreating();
            form.reset();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <Input
                            disabled={isSubmitting}
                            placeholder="e.g. 'Introduction to the course'"
                            {...form.register("title")}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
                        )}
                    </div>
                    <Button
                        disabled={!isValid || isSubmitting}
                        type="submit"
                    >
                        Create
                    </Button>
                </form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapters"}
                    {/* List of chapters */}
                    <div className="flex flex-col gap-y-2">
                        {initialData.chapters.map((chapter) => (
                            <div
                                key={chapter.id}
                                className={cn(
                                    "flex items-center gap-x-2 bg-slate-200 dark:bg-slate-800 border-slate-200 border text-slate-700 dark:text-slate-200 rounded-md mb-2 text-sm",
                                    chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-300"
                                )}
                            >
                                <div className="px-2 py-3 border-r border-r-slate-200 dark:border-r-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-l-md transition cursor-pointer">
                                    <div className="h-5 w-5 flex items-center justify-center">
                                        ::
                                    </div>
                                </div>
                                {chapter.title}
                                <div className="ml-auto pr-2 flex items-center gap-x-2">
                                    {chapter.isFree && (
                                        <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                            Free
                                        </span>
                                    )}
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full bg-slate-500 text-white",
                                        chapter.isPublished && "bg-sky-700"
                                    )}>
                                        {chapter.isPublished ? "Published" : "Draft"}
                                    </span>
                                    <Link href={`/teacher/courses/${courseId}/chapters/${chapter.id}`}>
                                        <Pencil className="h-4 w-4 cursor-pointer hover:opacity-75 transition" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters (Coming soon)
                </p>
            )}
        </div>
    )
}
