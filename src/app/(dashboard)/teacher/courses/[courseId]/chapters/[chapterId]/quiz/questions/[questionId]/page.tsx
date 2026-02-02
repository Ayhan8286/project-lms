import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";

import { QuestionPromptForm } from "./_components/QuestionPromptForm";
import { QuestionAnswersForm } from "./_components/QuestionAnswersForm";
import { QuestionActions } from "./_components/QuestionActions";

const QuestionIdPage = async ({
    params
}: {
    params: Promise<{ courseId: string; chapterId: string; questionId: string }>
}) => {
    const { userId } = await auth();
    const { courseId, chapterId, questionId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const question = await db.question.findUnique({
        where: {
            id: questionId,
        },
        include: {
            answers: {
                orderBy: {
                    text: "asc",
                }
            }
        }
    });

    if (!question) {
        return redirect("/");
    }

    const totalAnswers = question.answers.length;
    const hasCorrectAnswer = question.answers.some((a) => a.isCorrect);

    const isComplete = totalAnswers >= 2 && hasCorrectAnswer;
    const completionText = isComplete ? "(Valid)" : "(Invalid: Need 2+ options & 1 correct)";

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${courseId}/chapters/${chapterId}/quiz`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to quiz setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Question Setup
                            </h1>
                            <span className="text-sm text-slate-700">
                                Status: {completionText}
                            </span>
                        </div>
                        <QuestionActions
                            courseId={courseId}
                            chapterId={chapterId}
                            questionId={questionId}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-sky-100 p-2 rounded-full">
                            <LayoutDashboard className="h-4 w-4 text-sky-700" />
                        </div>
                        <h2 className="text-xl">
                            Question Prompt
                        </h2>
                    </div>
                    <QuestionPromptForm
                        initialData={question}
                        courseId={courseId}
                        chapterId={chapterId}
                        questionId={questionId}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-sky-100 p-2 rounded-full">
                            <ListChecks className="h-4 w-4 text-sky-700" />
                        </div>
                        <h2 className="text-xl">
                            Answers
                        </h2>
                    </div>
                    <QuestionAnswersForm
                        initialData={question}
                        courseId={courseId}
                        chapterId={chapterId}
                        questionId={questionId}
                    />
                </div>
            </div>
        </div>
    );
}

export default QuestionIdPage;
