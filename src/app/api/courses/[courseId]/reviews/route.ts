import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        const { rating, comment } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
            }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        // Verify purchase? 
        // Ideally only students can review. 
        // But for now, let's allow anyone authorized (or maybe check purchase).
        const purchase = await db.invoice.findFirst({
            where: {
                userId,
                courseId,
                status: "PAID"
            }
        });

        // Uncomment to enforce review only by students
        /*
        if (!purchase) {
            return new NextResponse("Not enrolled", { status: 403 });
        }
        */

        const review = await db.review.create({
            data: {
                userId,
                courseId,
                rating,
                comment,
            }
        });

        return NextResponse.json(review);

    } catch (error) {
        console.log("[REVIEW_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
