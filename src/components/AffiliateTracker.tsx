"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const AffiliateTracker = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            // Set cookie for 30 days
            document.cookie = `affiliate_code=${ref}; path=/; max-age=${60 * 60 * 24 * 30}`;
        }
    }, [searchParams]);

    return null;
};
