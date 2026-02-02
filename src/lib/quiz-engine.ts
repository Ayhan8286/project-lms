import { db } from "@/lib/db";

export const gradeQuiz = async (quizId: string, answers: Record<string, string>) => {
    // answers = { questionId: answerId }

    const quiz = await db.quiz.findUnique({
        where: { id: quizId },
        include: {
            questions: {
                include: { answers: true }
            }
        }
    });

    if (!quiz) throw new Error("Quiz not found");

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q: { id: string; answers: { id: string; isCorrect: boolean }[] }) => {
        const userAnswerId = answers[q.id];
        const correctAnswer = q.answers.find((a: { isCorrect: boolean; id: string }) => a.isCorrect);

        if (correctAnswer && userAnswerId === correctAnswer.id) {
            correctCount++;
        }
    });

    return {
        score: (correctCount / totalQuestions) * 100,
        correctCount,
        totalQuestions,
        passed: (correctCount / totalQuestions) >= 0.7 // 70% passing grade
    };
};
