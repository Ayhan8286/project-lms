"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Assignment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { cn } from "@/lib/utils";

interface AssignmentFormProps {
    initialData: Assignment | null;
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    instruction: z.string().min(1),
});

export const AssignmentForm = ({
    initialData,
    courseId,
    chapterId
}: AssignmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            instruction: initialData?.instruction || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/assignment`, values);
            toast.success("Assignment updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Assignment instructions
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit instructions
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData?.instruction && "text-slate-500 italic"
                )}>
                    {!initialData?.instruction && "No instructions set"}
                    {initialData?.instruction && (
                        <Preview value={initialData.instruction} />
                    )}
                </div>
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <Editor
                        {...form.register("instruction")}
                        // Editor likely uses onChange, not direct register if it's a rich text custom component.
                        // I will assume Editor accepts 'value' and 'onChange'.
                        value={form.getValues("instruction")}
                        onChange={(value) => form.setValue("instruction", value)}
                    />
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
