import { Menu } from "lucide-react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { NotificationButton } from "@/components/NotificationButton";
import { CurrencySelector } from "@/components/CurrencySelector";
import { XPDisplay } from "@/components/XPDisplay";
import { LanguageToggle } from "@/components/LanguageToggle";

export const Navbar = () => {
    return (
        <div className="flex items-center p-4 h-full border-b shadow-sm bg-background dark:border-border">
            <button className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </button>

            <div className="hidden md:block">
                <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                    Al Huda Network
                </span>
            </div>

            <div className="flex w-full justify-end items-center gap-x-2">
                <XPDisplay />
                <CurrencySelector />
                <NotificationButton />
                <LanguageToggle />
                <ModeToggle />
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                    <Link href="/login-options">
                        <Button size="sm" variant="ghost">Login</Button>
                    </Link>
                </SignedOut>
            </div>
        </div>
    );
};
