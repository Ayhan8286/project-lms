import { db } from "@/lib/db";
import { SearchInput } from "@/components/SearchInput";
import { CoursesList } from "@/components/CoursesList";
import { Categories } from "@/components/Categories"; // We'll need to create this too
import { PriceFilter } from "@/components/PriceFilter";

interface SearchPageProps {
    searchParams: Promise<{
        title?: string;
        categoryId?: string;
        price?: string;
    }>;
}

export default async function SearchPage({
    searchParams
}: SearchPageProps) {
    const { title, categoryId, price } = await searchParams;

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const courses = await db.course.findMany({
        where: {
            isPublished: true,
            title: {
                contains: title,
            },
            categoryId: categoryId,
            price: price === "free" ? 0 : undefined,
        },
        include: {
            category: true,
            chapters: {
                where: {
                    isPublished: true,
                },
                select: {
                    id: true,
                }
            },
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <div className="flex items-center gap-x-2">
                    <SearchInput />
                    <PriceFilter />
                </div>
            </div>

            <div className="p-6 space-y-4">
                <Categories items={categories} />

                <div className="hidden md:flex items-center gap-x-2">
                    <PriceFilter />
                </div>

                <CoursesList items={courses} />
            </div>
        </>
    );
}
