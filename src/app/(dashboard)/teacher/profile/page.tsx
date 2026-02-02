"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming we have this, if not I'll treat as input
import { useState, useEffect } from "react";

const formSchema = z.object({
    bio: z.string().min(1, { message: "Bio is required" }),
    websiteUrl: z.string().optional(),
    twitterUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
});

export default function TeacherProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // We need to fetch initial data. 
    // For now, let's assume we fetch it via a server action or API.
    // Let's create a Client Component that fetches on mount or receives props.
    // Better: Make this a Client Component and fetch in useEffect or use a Server Component wrapper.

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bio: "",
            websiteUrl: "",
            twitterUrl: "",
            linkedinUrl: "",
        }
    });

    useEffect(() => {
        // Fetch profile
        fetch("/api/teacher/profile")
            .then(res => res.json())
            .then(data => {
                if (data) {
                    form.reset({
                        bio: data.bio || "",
                        websiteUrl: data.websiteUrl || "",
                        twitterUrl: data.twitterUrl || "",
                        linkedinUrl: data.linkedinUrl || "",
                    });
                }
            })
            .catch(() => { });
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/teacher/profile", {
                method: "PATCH", // UPSERT logic
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error("Failed");

            toast.success("Profile updated");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Teacher Profile</h1>
            <p className="text-muted-foreground mb-8">
                Manage your public instructor profile.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
                <div>
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                        disabled={isLoading}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell students about yourself..."
                        {...form.register("bio")}
                    />
                    {form.formState.errors.bio && (
                        <p className="text-sm text-red-500 mt-1">{form.formState.errors.bio.message}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium">Website URL</label>
                    <Input
                        disabled={isLoading}
                        placeholder="https://example.com"
                        {...form.register("websiteUrl")}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Twitter URL</label>
                        <Input
                            disabled={isLoading}
                            placeholder="https://twitter.com/..."
                            {...form.register("twitterUrl")}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">LinkedIn URL</label>
                        <Input
                            disabled={isLoading}
                            placeholder="https://linkedin.com/in/..."
                            {...form.register("linkedinUrl")}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-x-2">
                    <Button type="submit" disabled={isLoading}>
                        Save Profile
                    </Button>
                </div>
            </form>
        </div>
    );
}
