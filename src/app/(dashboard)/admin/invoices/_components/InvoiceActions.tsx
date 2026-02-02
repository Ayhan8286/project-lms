"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface InvoiceActionsProps {
    invoiceId: string;
    currentStatus: string;
}

export const InvoiceActions = ({
    invoiceId,
    currentStatus
}: InvoiceActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onUpdate = async (status: string) => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/admin/invoices/${invoiceId}/status`, { status });
            toast.success(`Invoice marked as ${status}`);
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-2">
            {currentStatus !== "PAID" && (
                <Button onClick={() => onUpdate("PAID")} disabled={isLoading} size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Paid
                </Button>
            )}
            {currentStatus !== "VOID" && (
                <Button onClick={() => onUpdate("VOID")} disabled={isLoading} size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <XCircle className="h-4 w-4 mr-2" />
                    Void
                </Button>
            )}
            {currentStatus !== "PENDING" && (
                <Button onClick={() => onUpdate("PENDING")} disabled={isLoading} size="sm" variant="ghost">
                    <Clock className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
