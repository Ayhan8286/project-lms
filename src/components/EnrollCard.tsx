"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { createInvoice } from "@/actions/create-invoice";
import { formatPrice } from "@/lib/format";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { GiftButton } from "@/components/GiftButton";

interface EnrollCardProps {
    course: Course;
    isPurchased: boolean;
}

export const EnrollCard = ({ course, isPurchased }: EnrollCardProps) => {
    const [isLoading, startTransition] = useTransition(); // Using server action directly
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null);
    const router = useRouter();

    const price = course.price || 0;
    const finalPrice = appliedCoupon ? Math.max(0, price - appliedCoupon.discount) : price;

    const onEnroll = () => {
        startTransition(() => {
            createInvoice(course.id, isApplied ? couponCode : undefined)
                .then(() => {
                    toast.success("Redirecting to billing...");
                    router.push("/billing");
                })
                .catch(() => toast.error("Something went wrong"));
        });
    };

    // Check if appliedCoupon matches current input or state
    const isApplied = appliedCoupon && appliedCoupon.code === couponCode;

    const hasAccess = isPurchased || price === 0;

    const onApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            // Verify coupon via API
            const res = await fetch("/api/coupons/verify", {
                method: "POST",
                body: JSON.stringify({ code: couponCode, courseId: course.id }),
            });
            if (!res.ok) throw new Error("Invalid coupon");
            const data = await res.json();

            setAppliedCoupon({ code: data.code, discount: data.discountAmount });
            toast.success("Coupon applied!");
        } catch {
            toast.error("Invalid or expired coupon");
            setAppliedCoupon(null);
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-medium text-lg">
                        {finalPrice === 0 ? "Free" : `PKR ${finalPrice.toLocaleString()}`}
                    </span>
                    {appliedCoupon && (
                        <span className="text-xs text-muted-foreground line-through">
                            PKR {price.toLocaleString()}
                        </span>
                    )}
                </div>

                {hasAccess ? (
                    <Button
                        onClick={() => router.push(`/courses/${course.id}/chapters/${course.id}`)} // Need first chapter ID logic or handle in component
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        Continue Learning
                    </Button>
                ) : (
                    <Button
                        onClick={onEnroll}
                        disabled={isLoading}
                        className="bg-sky-700 hover:bg-sky-800"
                    >
                        Enroll Now
                    </Button>
                )}
            </div>

            {!hasAccess && price > 0 && (
                <div className="flex items-center gap-x-2">
                    <Input
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={isLoading || !!appliedCoupon}
                        className="bg-white dark:bg-slate-950 h-9"
                    />
                    <Button
                        onClick={onApplyCoupon}
                        disabled={isLoading || !!appliedCoupon || !couponCode}
                        variant="outline"
                        size="sm"
                    >
                        Apply
                    </Button>
                </div>
            )}

            {!hasAccess && price > 0 && (
                <GiftButton courseId={course.id} price={price} />
            )}
        </div>
    );
};
