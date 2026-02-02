"use client";

import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { createInvoice } from "@/actions/create-invoice";
import { useRouter } from "next/navigation";

interface GiftButtonProps {
    courseId: string;
    price: number;
}

export const GiftButton = ({ courseId, price }: GiftButtonProps) => {
    const [isLoading, startTransition] = useTransition();
    const router = useRouter();

    const onGift = () => {
        if (price === 0) {
            toast.error("Cannot gift free courses.");
            return;
        }

        startTransition(() => {
            // We need to update createInvoice to handle isGift arg
            // For now, let's assume we'll update it momentarily.
            createInvoice(courseId, undefined, true)
                .then(() => {
                    toast.success("Redirecting to billing for Gift...");
                    router.push("/billing");
                })
                .catch(() => toast.error("Something went wrong"));
        });
    }

    return (
        <Button
            onClick={onGift}
            disabled={isLoading}
            variant="outline"
            className="w-full mt-2 gap-x-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
        >
            <Gift className="h-4 w-4" />
            Gift this Course
        </Button>
    );
};
