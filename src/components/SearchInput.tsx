"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 500); // We'll need to create this hook if it doesn't exist, or just implementing inside.

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = new URL(window.location.href);
        if (debouncedValue) {
            url.searchParams.set("title", debouncedValue);
        } else {
            url.searchParams.delete("title");
        }
        router.push(url.toString());
    }, [debouncedValue, router, pathname]); // Simplified logic

    return (
        <div className="relative w-full md:max-w-md">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-input bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
                placeholder="Search for a course..."
            />
        </div>
    )
}
