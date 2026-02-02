"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Play, RotateCcw } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti";

interface QuizAppProps {
    courseId: string;
    chapterId: string;
    quiz: {
        id: string;
        title: string;
        questions: {
            id: string;
            prompt: string;
            answers: {
                id: string;
                text: string;
            }[];
        }[];
    };
    initialStats?: {
        score: number;
        passed: boolean;
    } | null;
}

export const QuizApp = ({ courseId, chapterId, quiz, initialStats }: QuizAppProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();

    // State
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // { questionId: answerId }
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<{
        score: number;
        correctCount: number;
        totalQuestions: number;
        passed: boolean;
    } | null>(null);

    const question = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    const onSelect = (answerId: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [question.id]: answerId,
        }));
    };

    const onNext = () => {
        if (isLastQuestion) {
            submitQuiz();
        } else {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const submitQuiz = async () => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/quiz/grade`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quizId: quiz.id,
                    answers: selectedAnswers,
                }),
            });

            if (!response.ok) {
                toast.error("Failed to grade quiz");
                return;
            }

            const data = await response.json();
            setResults(data);

            if (data.passed) {
                toast.success("Quiz Passed!");
                confetti.onOpen();
                router.refresh();
            } else {
                toast.error("Quiz Failed. Try again.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onRetry = () => {
        setResults(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setStarted(true);
    };

    if (!started && !results) {
        return (
            <div className="max-w-3xl mx-auto p-8 border rounded-lg bg-card text-center mt-6">
                <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
                <p className="text-muted-foreground mb-8">
                    This quiz contains {quiz.questions.length} questions.
                    You need 70% to pass.
                </p>
                <div className="flex justify-center gap-x-4">
                    <Button onClick={() => setStarted(true)} size="lg" className="gap-x-2">
                        <Play className="h-4 w-4" />
                        {initialStats ? "Retake Quiz" : "Start Quiz"}
                    </Button>
                </div>
                {initialStats && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Previous Result: <span className={cn("font-bold", initialStats.passed ? "text-emerald-500" : "text-rose-500")}>
                                {initialStats.score}% {initialStats.passed ? "(Passed)" : "(Failed)"}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (results) {
        return (
            <div className="max-w-3xl mx-auto p-8 border rounded-lg bg-card text-center mt-6 space-y-6">
                <h2 className="text-2xl font-bold">Quiz Results</h2>

                <div className="flex items-center justify-center gap-x-4">
                    <div className={cn(
                        "p-6 rounded-full border-4 text-3xl font-bold w-32 h-32 flex items-center justify-center",
                        results.passed ? "border-emerald-500 text-emerald-500 bg-emerald-50" : "border-rose-500 text-rose-500 bg-rose-50"
                    )}>
                        {Math.round(results.score)}%
                    </div>
                </div>

                <div className="text-muted-foreground">
                    You got {results.correctCount} out of {results.totalQuestions} questions correct.
                </div>

                <div className="flex justify-center gap-x-4">
                    {!results.passed && (
                        <Button onClick={onRetry} variant="outline" className="gap-x-2">
                            <RotateCcw className="h-4 w-4" />
                            Retry Quiz
                        </Button>
                    )}
                    {results.passed && (
                        <Button onClick={() => router.push(`/courses/${courseId}`)} className="bg-emerald-600 hover:bg-emerald-700">
                            Continue Course
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-6 mt-6">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="h-2 w-full bg-secondary rounded-full">
                    <div
                        className="h-full bg-sky-700 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                    <span>{Math.round(((currentQuestionIndex) / quiz.questions.length) * 100)}%</span>
                </div>
            </div>

            <div className="border rounded-lg bg-card p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-6">
                    {question.prompt}
                </h3>

                <div className="space-y-3">
                    {question.answers.map((answer) => {
                        const isSelected = selectedAnswers[question.id] === answer.id;
                        return (
                            <div
                                key={answer.id}
                                onClick={() => onSelect(answer.id)}
                                className={cn(
                                    "p-4 border rounded-md cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900",
                                    isSelected && "border-sky-500 bg-sky-50 dark:bg-sky-900/10 ring-1 ring-sky-500"
                                )}
                            >
                                <div className="flex items-center gap-x-3">
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center",
                                        isSelected && "border-sky-500 bg-sky-500"
                                    )}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="text-sm">{answer.text}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={onNext}
                        disabled={!selectedAnswers[question.id] || isSubmitting}
                    >
                        {isLastQuestion ? "Submit" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
