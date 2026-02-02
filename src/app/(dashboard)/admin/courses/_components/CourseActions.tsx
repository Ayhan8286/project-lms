"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CourseActionsProps {
    courseId: string;
    isPublished: boolean;
}

export const CourseActions = ({
    courseId,
    isPublished
}: CourseActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onApprove = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/admin/courses/${courseId}/publish`);
            toast.success("Course approved & published");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onReject = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/admin/courses/${courseId}/unpublish`);
            toast.success("Course rejected & unpublished");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-2">
            {!isPublished && (
                <Button onClick={onApprove} disabled={isLoading} size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                </Button>
            )}
            {isPublished && (
                <Button onClick={onReject} disabled={isLoading} size="sm" variant="outline" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                </Button>
            )}

            <Link href={`/courses/${courseId}`} target="_blank">
                <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                </Button>
            </Link>
        </div>
    )
}
