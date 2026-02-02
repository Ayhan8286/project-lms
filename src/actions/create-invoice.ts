"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createInvoice(courseIdOrAmount: string | number, couponCode?: string, isGift: boolean = false) {
    try {
        const { userId } = await auth();
        const user = await currentUser();
        const cookieStore = await cookies();
        const affiliateCode = cookieStore.get("affiliate_code")?.value;

        if (!userId || !user) {
            return { error: "Unauthorized" };
        }

        let courseId: string | null = null;
        let amount = 0;

        if (typeof courseIdOrAmount === "string") {
            courseId = courseIdOrAmount;
            const course = await db.course.findUnique({
                where: {
                    id: courseId,
                    isPublished: true,
                }
            });

            if (!course) {
                return { error: "Course not found" };
            }

            amount = course.price || 0;

            if (couponCode) {
                const coupon = await db.coupon.findUnique({
                    where: {
                        code: couponCode,
                        isActive: true,
                    }
                });

                if (coupon && (!coupon.courseId || coupon.courseId === courseId)) {
                    amount = Math.max(0, amount - coupon.discountAmount);
                }
            }
        } else {
            amount = courseIdOrAmount;
        }

        const invoice = await db.invoice.create({
            data: {
                userId,
                courseId,
                amount,
                status: "PENDING",
                dueDate: new Date(),
                isGift,
                affiliateCode,
            }
        });

        return invoice;

    } catch (error) {
        console.log("[CREATE_INVOICE]", error);
        return { error: "Internal Error" };
    }
}
