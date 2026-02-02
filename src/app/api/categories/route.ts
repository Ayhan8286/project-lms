import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export async function POST(
    req: Request,
) {
    try {
        const { userId } = await auth();
        const { name } = await req.json();

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const category = await db.category.create({
            data: {
                name,
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log("[CATEGORY_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
