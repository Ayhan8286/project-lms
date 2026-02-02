import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({
    userId,
    courseId,
    chapterId,
}: GetChapterProps) => {
    try {
        const purchase = await db.invoice.findFirst({
            where: {
                userId,
                courseId,
                status: "PAID", // Assumes PAID status. For now, maybe we allow PENDING too if manual? Let's strict to PAID.
            },
        });

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId,
            },
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
            include: {
                comments: {
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                assignment: {
                    include: {
                        submissions: true,
                    }
                },
                quiz: {
                    include: {
                        questions: {
                            include: {
                                answers: {
                                    select: {
                                        id: true,
                                        text: true,
                                        // Exclude isCorrect
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase || course.price === 0) { // Free or Purchased
            // TODO: Mux Data if we used it.
            // muxData = await db.muxData.findUnique({ where: { chapterId } });

            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId
                }
            });
        }

        if (chapter.isFree || purchase || course.price === 0) {
            // Mux data is allowed
            // muxData = ...
        }

        // Find next chapter
        nextChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId,
                isPublished: true,
                position: {
                    gt: chapter.position,
                }
            },
            orderBy: {
                position: "asc",
            },
        });

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            }
        });

        const chapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            include: {
                userProgress: {
                    where: {
                        userId,
                    },
                },
            },
            orderBy: {
                position: "asc",
            },
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
            chapters,
        };
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        };
    }
};
