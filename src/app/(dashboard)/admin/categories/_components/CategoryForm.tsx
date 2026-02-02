"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export const CategoryForm = () => {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async () => {
        if (!name) return;

        try {
            setIsLoading(true);
            await axios.post("/api/categories", { name });
            toast.success("Subject created");
            setName("");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Input
                placeholder="e.g. 'Computer Science'"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
            />
            <Button onClick={onSubmit} disabled={isLoading || !name}>
                <Plus className="h-4 w-4 mr-2" />
                Add
            </Button>
        </div>
    )
}
