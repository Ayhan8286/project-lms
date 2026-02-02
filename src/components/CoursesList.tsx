import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/CourseCard";

type CourseWithProgress = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress?: number | null; // We might want to pass progress if we have it, but for Search page we might not fetch user progress for every course immediately unless we optimize. 
    // For now, let's assume we don't handle progress in the global search or we handle it inside CourseCard if we fetch it differently.
    // Actually, the previous mockup showed "Free" or price. 
    // Current schema has no price. So maybe we just show "Free".
};

interface CoursesListProps {
    items: CourseWithProgress[];
}

export const CoursesList = ({
    items
}: CoursesListProps) => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chaptersLength={item.chapters.length}
                        category={item.category?.name!}
                        progress={item.progress}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No courses found
                </div>
            )}
        </div>
    )
}
