"use client";

import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { Search, File } from "lucide-react";
import { useRouter } from "next/navigation";

export const SearchCommand = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Mock results (In real app, fetch from API)
    // For now, let's just show typical pages plus minimal search if we fetch courses.
    // Better: Fetch standard routes.

    const run = (command: () => void) => {
        setOpen(false);
        command();
    }

    if (!open) return null;

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
            <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-0 shadow-lg sm:rounded-lg">
                <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <CommandInput
                        placeholder="Type a command or search..."
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        value={query}
                        onValueChange={setQuery}
                    />
                </div>
                <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                    <CommandEmpty className="py-6 text-center text-sm">No results found.</CommandEmpty>
                    <CommandGroup heading="General">
                        <CommandItem onSelect={() => run(() => router.push("/dashboard"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            <File className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => run(() => router.push("/search"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            <Search className="mr-2 h-4 w-4" />
                            <span>Browse Courses</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </div>
        </CommandDialog>
    );
};
