import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { code, courseId } = await req.json();

        const coupon = await db.coupon.findUnique({
            where: {
                code,
                isActive: true,
            }
        });

        if (!coupon) {
            return new NextResponse("Invalid coupon", { status: 404 });
        }

        // Check if coupon is for specific course
        if (coupon.courseId && coupon.courseId !== courseId) {
            return new NextResponse("Coupon not valid for this course", { status: 400 });
        }

        return NextResponse.json(coupon);

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
