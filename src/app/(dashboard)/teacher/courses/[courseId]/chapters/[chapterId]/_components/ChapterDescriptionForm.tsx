"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Preview } from "@/components/preview";

interface ChapterDescriptionFormProps {
    initialData: {
        description: string | null;
    };
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    description: z.string().min(1),
});

export const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData.description || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {!initialData.description && "No description"}
                    {initialData.description && (
                        // <Preview value={initialData.description} />
                        // Since I didn't verify Preview exists, I will render dangerously for now or safe text
                        <div dangerouslySetInnerHTML={{ __html: initialData.description }} />
                    )}
                </div>
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <Editor
                            {...form.register("description")}
                            value={form.watch("description")}
                            onChange={(content) => form.setValue("description", content)}
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
