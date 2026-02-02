"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    courseId: string;
}

export const ReviewForm = ({ courseId }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch(`/api/courses/${courseId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment }),
            });

            if (!response.ok) throw new Error("Failed");

            toast.success("Review submitted!");
            setComment("");
            setRating(0);
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
            <form onSubmit={onSubmit}>
                <div className="flex items-center gap-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`transition ${star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <Star className="h-6 w-6 fill-current" />
                        </button>
                    ))}
                </div>
                <textarea
                    className="w-full p-3 rounded-md bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 mb-4"
                    placeholder="Share your experience..."
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isLoading}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading || rating === 0} className="bg-emerald-600 hover:bg-emerald-700">
                        Post Review
                    </Button>
                </div>
            </form>
        </div>
    );
};
