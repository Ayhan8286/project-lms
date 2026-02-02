"use client";

import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

interface AttendanceButtonProps {
    courseId: string;
    studentId: string;
};

export const AttendanceButton = ({
    courseId,
    studentId
}: AttendanceButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.post(`/api/courses/${courseId}/attendance`, {
                studentId,
            });
            toast.success("Marked present");
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Mark Present
        </Button>
    )
}
