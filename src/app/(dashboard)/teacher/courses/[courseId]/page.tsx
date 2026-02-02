import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { LayoutDashboard, ListChecks, DollarSign, File } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TitleForm } from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { CategoryForm } from "./_components/CategoryForm";
import { PriceForm } from "./_components/PriceForm";
import { AttachmentForm } from "./_components/AttachmentForm";
import { ChaptersForm } from "./_components/ChaptersForm";
import { Actions } from "./_components/Actions";

const CourseIdPage = async ({
    params
}: {
    params: Promise<{ courseId: string }>
}) => {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    // Fetch categories for dropdown
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if (!course) {
        return redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Course setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
                <Actions disabled={!isComplete} courseId={course.id} isPublished={course.isPublished} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-sky-100 p-2 rounded-full">
                            <LayoutDashboard className="h-4 w-4 text-sky-700" />
                        </div>
                        <h2 className="text-xl">
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-sky-100 p-2 rounded-full">
                                <ListChecks className="h-4 w-4 text-sky-700" />
                            </div>
                            <h2 className="text-xl">
                                Course chapters
                            </h2>
                        </div>
                        <ChaptersForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-sky-100 p-2 rounded-full">
                                <DollarSign className="h-4 w-4 text-sky-700" />
                            </div>
                            <h2 className="text-xl">
                                Sell your course
                            </h2>
                        </div>
                        <PriceForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-sky-100 p-2 rounded-full">
                                <File className="h-4 w-4 text-sky-700" />
                            </div>
                            <h2 className="text-xl">
                                Resources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <h2 className="text-xl">
                                Student Management
                            </h2>
                        </div>
                        <Link href={`/teacher/courses/${course.id}/attendance`}>
                            <Button variant="outline" className="w-full">
                                Manage Attendance
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseIdPage;
