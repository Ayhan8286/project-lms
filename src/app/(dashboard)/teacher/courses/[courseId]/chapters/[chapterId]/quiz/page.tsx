import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";

import { QuizTitleForm } from "./_components/QuizTitleForm";
import { QuizQuestionsForm } from "./_components/QuizQuestionsForm";
// import { QuizActions } from "./_components/QuizActions";

const QuizPage = async ({
    params
}: {
    params: Promise<{ courseId: string; chapterId: string }>
}) => {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId,
        },
    });

    if (!chapter) {
        return redirect("/");
    }

    const quiz = await db.quiz.findUnique({
        where: {
            chapterId: chapterId,
        },
        include: {
            questions: {
                orderBy: {
                    createdAt: "asc",
                },
                include: {
                    answers: true, // Need answers to show validity or summary
                }
            }
        }
    });

    // If quiz doesn't exist, we might want to auto-create it or show a "Create" button.
    // For smoother UX, let's treat "Manage Quiz" as "Get or Create".
    // But we are server component here. We can't write.
    // So we will render a "Create Quiz" state if null, or the Form if exists.

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${courseId}/chapters/${chapterId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to chapter setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Quiz Setup
                            </h1>
                            <span className="text-sm text-slate-700">
                                Be sure to add at least one question with a correct answer.
                            </span>
                        </div>
                        {/* <QuizActions /> */}
                    </div>
                </div>
            </div>

            {!quiz ? (
                <div className="mt-6 flex flex-col items-center justify-center p-10 bg-slate-100 rounded-md">
                    <p className="text-sm text-slate-500 mb-4">No quiz created for this chapter yet.</p>
                    {/* We need a client component to trigger creation */}
                    <Link href={`/teacher/courses/${courseId}/chapters/${chapterId}/quiz/create`}>
                        {/* Better: Inline Client Component "QuizCreateButton" */}
                        {/* But for now, I'll just use a Create Page or api call. */}
                        {/* Let's make a generic "CreateQuizForm" which is just a button "Create Quiz" */}
                    </Link>
                    {/* Actually, let's just make QuizTitleForm handle creation if no quiz? 
                        No, initialData is needed. 
                    */}
                    <form action={`/api/courses/${courseId}/chapters/${chapterId}/quiz/create`} method="POST">
                        {/* Native form post? No, use client component. */}
                        <p>Please implement Quiz Creation Button</p>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <div className="bg-sky-100 p-2 rounded-full">
                                    <LayoutDashboard className="h-4 w-4 text-sky-700" />
                                </div>
                                <h2 className="text-xl">
                                    Customize your quiz
                                </h2>
                            </div>
                            <QuizTitleForm
                                initialData={quiz}
                                courseId={courseId}
                                chapterId={chapterId}
                                quizId={quiz.id}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-sky-100 p-2 rounded-full">
                                <ListChecks className="h-4 w-4 text-sky-700" />
                            </div>
                            <h2 className="text-xl">
                                Questions
                            </h2>
                        </div>
                        <QuizQuestionsForm
                            initialData={quiz}
                            courseId={courseId}
                            chapterId={chapterId}
                            quizId={quiz.id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizPage;
