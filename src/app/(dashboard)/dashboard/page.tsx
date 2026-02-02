import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/CoursesList";
import { CheckCircle, Clock } from "lucide-react";
import { Hero } from "./_components/Hero";
import { DataCard } from "@/components/DataCard";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        completedCourses,
        coursesInProgress,
        totalCompletedChapters
    } = await getDashboardCourses(userId);

    return (
        <div className="p-6 space-y-4">
            <Hero />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DataCard
                    icon={Clock}
                    label="In Progress"
                    value={coursesInProgress.length}
                />
                <DataCard
                    icon={CheckCircle}
                    label="Completed Courses"
                    value={completedCourses.length}
                />
                <DataCard
                    icon={CheckCircle}
                    label="Completed Chapters"
                    value={totalCompletedChapters}
                />
            </div>

            <h2 className="text-xl font-semibold text-foreground mt-6">
                Continue Learning
            </h2>

            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        </div>
    )
}

