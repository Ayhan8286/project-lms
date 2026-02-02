"use client";

import { Category } from "@prisma/client";
import {
    Music,
    Camera,
    Dumbbell,
    CircleDollarSign,
    Monitor,
    Film,
    Wrench
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], LucideIcon> = {
    "Music": Music,
    "Photography": Camera,
    "Fitness": Dumbbell,
    "Accounting": CircleDollarSign,
    "Computer Science": Monitor,
    "Filming": Film,
    "Engineering": Wrench,
};

export const Categories = ({
    items,
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}

const CategoryItem = ({
    label,
    value,
    icon: Icon,
}: {
    label: string,
    value?: string,
    icon?: LucideIcon,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = new URL(window.location.href);

        // Preserve title if exists
        if (currentTitle) {
            url.searchParams.set("title", currentTitle);
        } else {
            // Ensure title param is clean if empty (though logic above preserves it)
            // But we might want to check if the user is clearing category
        }

        // Toggle category
        if (isSelected) {
            url.searchParams.delete("categoryId");
        } else {
            url.searchParams.set("categoryId", value!);
        }

        router.push(url.toString());
    };

    return (
        <button
            onClick={onClick}
            className={`
                py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition
                ${isSelected ? "border-sky-700 bg-sky-200/20 text-sky-800" : "bg-transparent"}
            `}
            type="button"
        >
            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}
