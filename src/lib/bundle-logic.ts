import { db } from "@/lib/db";

export const createBundle = async (title: string, courseIds: string[], price: number) => {
    try {
        const bundle = await db.bundle.create({
            data: {
                title,
                price,
                courses: {
                    connect: courseIds.map((id) => ({ id }))
                }
            }
        });
        return bundle;
    } catch (error) {
        console.log("[CREATE_BUNDLE]", error);
        throw error;
    }
};

export const purchaseBundle = async (userId: string, bundleId: string) => {
    // 1. Get bundle courses
    const bundle = await db.bundle.findUnique({
        where: { id: bundleId },
        include: { courses: true }
    });

    if (!bundle) throw new Error("Bundle not found");

    // 2. Grant access to all courses (create N purchase records)
    // Simplified transaction
    await db.$transaction(
        bundle.courses.map(course =>
            db.invoice.create({
                data: {
                    userId,
                    courseId: course.id,
                    amount: 0,
                    status: "PAID",
                    dueDate: new Date()
                }
            })
        )
    );
};
