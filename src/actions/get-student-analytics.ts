import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export const getStudentAnalytics = async (userId: string) => {
    try {
        // 1. Get all courses owned by the teacher
        const courses = await db.course.findMany({
            where: {
                userId: userId,
            },
            include: {
                chapters: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        const courseIds = courses.map(c => c.id);
        const chapterIds = courses.flatMap(c => c.chapters.map(ch => ch.id));

        // 2. Get all students who purchased these courses
        const purchases = await db.invoice.findMany({
            where: {
                courseId: {
                    in: courseIds,
                },
                status: "PAID",
            },
            select: {
                userId: true,
                courseId: true,
            }
        });

        // Unique students
        const uniqueStudentIds = Array.from(new Set(purchases.map(p => p.userId)));

        // 3. Aggregate data per student
        const studentData = await Promise.all(uniqueStudentIds.map(async (studentId) => {
            // Fetch User Details
            let userDetails = { name: "Unknown", email: "No Email" };
            try {
                const client = await clerkClient();
                const user = await client.users.getUser(studentId);
                if (user) {
                    userDetails = {
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.emailAddresses[0]?.emailAddress || "No Email",
                    };
                }
            } catch (e) {
                console.log("User fetch error", e);
            }

            // Enrolled Courses Count (from the teacher's list)
            const enrolledCount = purchases.filter(p => p.userId === studentId).length;

            // Progress: Completed Chapters / Total Chapters in enrolled courses?
            // Or just average progress across *their* enrolled courses.
            // Let's get UserProgress for this student in the teacher's courses
            const progress = await db.userProgress.findMany({
                where: {
                    userId: studentId,
                    chapterId: {
                        in: chapterIds,
                    }
                }
            });

            const completedChapters = progress.filter(p => p.isCompleted).length;
            // Total chapters in courses this student is enrolled in?
            let totalChaptersForStudent = 0;
            const studentCourseIds = purchases.filter(p => p.userId === studentId).map(p => p.courseId);
            const studentCourses = courses.filter(c => studentCourseIds.includes(c.id));
            studentCourses.forEach(c => totalChaptersForStudent += c.chapters.length);

            const progressPercentage = totalChaptersForStudent > 0
                ? (completedChapters / totalChaptersForStudent) * 100
                : 0;

            // Quiz Scores (UserProgress.score)
            const quizScores = progress.filter(p => p.score !== null).map(p => p.score as number);
            const avgQuizScore = quizScores.length > 0
                ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
                : 0;

            // Assignment Grades
            // Need to find assignments in these courses
            const assignments = await db.assignment.findMany({
                where: {
                    chapter: {
                        courseId: {
                            in: courseIds,
                        }
                    }
                },
                select: {
                    id: true,
                }
            });
            const assignmentIds = assignments.map(a => a.id);

            const submissions = await db.assignmentSubmission.findMany({
                where: {
                    userId: studentId,
                    assignmentId: {
                        in: assignmentIds,
                    }
                },
                select: {
                    grade: true,
                }
            });

            const grades = submissions.filter(s => s.grade !== null).map(s => s.grade as number);
            const avgGrade = grades.length > 0
                ? grades.reduce((a, b) => a + b, 0) / grades.length
                : 0;

            return {
                studentId,
                name: userDetails.name,
                email: userDetails.email,
                enrolledCourses: enrolledCount,
                progress: Math.round(progressPercentage),
                avgQuizScore: Math.round(avgQuizScore),
                avgAssignmentGrade: Math.round(avgGrade),
            };
        }));

        return studentData;

    } catch (error) {
        console.log("[GET_STUDENT_ANALYTICS]", error);
        return [];
    }
}
