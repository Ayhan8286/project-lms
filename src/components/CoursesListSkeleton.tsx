import { CourseCardSkeleton } from "./CourseCardSkeleton";

export const CoursesListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
            ))}
        </div>
    );
};
