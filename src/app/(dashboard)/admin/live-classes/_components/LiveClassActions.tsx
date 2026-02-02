"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface LiveClassActionsProps {
    messageId: string;
}

export const LiveClassActions = ({
    messageId,
}: LiveClassActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/admin/live-classes/${messageId}/delete`);
            toast.success("Live class link removed");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={onDelete} disabled={isLoading} size="sm" variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            End Session
        </Button>
    )
}
