import { db } from "@/lib/db";

export const generateDigest = async (userId: string) => {
    const userProgress = await db.userProgress.findMany({
        where: {
            userId,
            updatedAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Last 7 days
            }
        },
        include: {
            chapter: {
                include: {
                    course: true
                }
            }
        }
    });

    const completedChapters = userProgress.filter(p => p.isCompleted).length;
    const coursesInteracted = new Set(userProgress.map(p => p.chapter.course.title)).size;

    return `
        <h1>Weekly Digest</h1>
        <p>Progres for the last 7 days:</p>
        <ul>
            <li><strong>${completedChapters}</strong> chapters completed</li>
            <li><strong>${coursesInteracted}</strong> courses active</li>
        </ul>
        <p>Keep up the good work!</p>
    `;
};
