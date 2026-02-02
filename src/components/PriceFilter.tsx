"use client";

import qs from "query-string";
import { DollarSign } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export const PriceFilter = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPrice = searchParams.get("price");
    const isFree = currentPrice === "free";

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: searchParams.get("title"),
                categoryId: searchParams.get("categoryId"),
                price: isFree ? null : "free", // Toggle
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <Button
            onClick={onClick}
            variant={isFree ? "default" : "outline"}
            size="sm"
            className="h-9 px-2 lg:px-3 text-xs"
        >
            <DollarSign className="mr-2 h-4 w-4" />
            {isFree ? "Free Only" : "Filter: Price"}
        </Button>
    )
}
