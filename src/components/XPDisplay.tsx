"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export const XPDisplay = () => {
    // In a real app, we'd use SWR or React Query to fetch this
    // For now, we'll fetch on mount
    const [xp, setXP] = useState<number | null>(null);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const res = await fetch("/api/user/points");
                const data = await res.json();
                setXP(data.xp);
            } catch {
                console.log("Failed to fetch points");
            }
        }
        fetchPoints();
    }, []);

    if (xp === null) return null;

    return (
        <div className="flex items-center gap-x-1 text-sky-700 dark:text-sky-400 font-medium text-sm mr-2">
            <Zap className="h-4 w-4 fill-sky-700 text-sky-700 dark:fill-sky-400 dark:text-sky-400" />
            {xp} XP
        </div>
    );

    // Placeholder for now as we don't have a GET endpoint yet
    return null;
};
