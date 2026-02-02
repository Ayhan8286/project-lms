"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Megaphone } from "lucide-react";

const AdminNotificationsPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        message: "",
        target: "ALL"
    });

    const onSubmit = async () => {
        if (!form.title || !form.message) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post("/api/admin/notifications", form);
            toast.success(`Sent to ${response.data.count} users`);
            setForm({ title: "", message: "", target: "ALL" });
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Megaphone className="h-6 w-6 text-orange-600" />
                Global Broadcast
            </h1>

            <div className="bg-white dark:bg-slate-950 border rounded-lg p-6 max-w-2xl space-y-6">

                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                        disabled={isLoading}
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. System Maintenance Update"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Audience</label>
                    <Select
                        disabled={isLoading}
                        onValueChange={(value) => setForm({ ...form, target: value })}
                        defaultValue={form.target}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Users</SelectItem>
                            <SelectItem value="TEACHERS">Teachers Only</SelectItem>
                            <SelectItem value="STUDENTS">Students Only</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        "Students" includes any user with enrollment data.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                        disabled={isLoading}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Write your broadcast message here..."
                        className="min-h-[150px]"
                    />
                </div>

                <Button onClick={onSubmit} disabled={isLoading} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Broadcast
                </Button>

            </div>
        </div>
    );
}

export default AdminNotificationsPage;
