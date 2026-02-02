"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    courseId: string;
    isWishlisted: boolean;
}

export const WishlistButton = ({ courseId, isWishlisted: initialIsWishlisted }: WishlistButtonProps) => {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/courses/${courseId}/wishlist`, {
                method: "POST",
            });
            const data = await response.json();
            setIsWishlisted(data.isWishlisted);
            toast.success(data.isWishlisted ? "Added to wishlist" : "Removed from wishlist");
            router.refresh(); // Refresh to update listings if needed
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className={cn("gap-x-2", isWishlisted && "text-rose-500 hover:text-rose-600")}
        >
            <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
            {isWishlisted ? "Saved" : "Save"}
        </Button>
    );
};
