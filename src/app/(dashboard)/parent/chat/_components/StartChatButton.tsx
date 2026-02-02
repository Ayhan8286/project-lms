"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface StartChatButtonProps {
    teacherId: string;
}

export const StartChatButton = ({
    teacherId
}: StartChatButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            // We'll use a new API route or an action.
            // Let's assume we create /api/conversations to POST { userId }
            // Actually, we can just call an action if we prefer, but for consistency with previous chat patterns (if any api existed)
            // I'll create a Server Action inside this file or nearby? No, keeping it clean.
            // Actually, I'll creates a simple API route for this: /api/conversations

            const response = await axios.post(`/api/conversations`, {
                userId: teacherId
            });

            router.push(`/parent/chat/${response.data.id}`);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={onClick} disabled={isLoading} className="w-full" variant="secondary">
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Chat
        </Button>
    )
}
