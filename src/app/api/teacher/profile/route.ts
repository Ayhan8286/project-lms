import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const profile = await db.teacherProfile.upsert({
            where: {
                userId,
            },
            update: {
                ...values,
            },
            create: {
                userId,
                ...values,
            }
        });

        return NextResponse.json(profile);

    } catch (error) {
        console.log("[TEACHER_PROFILE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const profile = await db.teacherProfile.findUnique({
            where: {
                userId,
            }
        });

        return NextResponse.json(profile);

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
