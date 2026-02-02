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

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingWishlist = await db.wishlist.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                }
            }
        });

        if (existingWishlist) {
            await db.wishlist.delete({
                where: {
                    id: existingWishlist.id,
                }
            });
            return NextResponse.json({ isWishlisted: false });
        } else {
            await db.wishlist.create({
                data: {
                    userId,
                    courseId,
                }
            });
            return NextResponse.json({ isWishlisted: true });
        }

    } catch (error) {
        console.log("[WISHLIST_TOGGLE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
