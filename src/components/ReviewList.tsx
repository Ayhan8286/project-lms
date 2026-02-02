import { Review } from "@prisma/client";
import { Star, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
    reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold">Student Reviews</h3>
            {reviews.length === 0 && (
                <p className="text-muted-foreground">No reviews yet. Be the first!</p>
            )}
            {reviews.map((review) => (
                <div key={review.id} className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-x-2">
                            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-sm">Student</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        {review.comment}
                    </p>
                </div>
            ))}
        </div>
    );
};
