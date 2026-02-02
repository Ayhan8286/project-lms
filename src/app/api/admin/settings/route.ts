import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

// GET all settings
export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const settings = await db.systemSetting.findMany();

        // Convert array to object for easier frontend consumption
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(settingsMap);

    } catch (error) {
        console.log("[SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// UPDATE settings
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { values } = await req.json(); // Expect object { key: value }

        if (!await isAdmin(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Upsert each setting
        for (const [key, value] of Object.entries(values)) {
            await db.systemSetting.upsert({
                where: { key: key },
                update: {
                    value: String(value),
                    updatedBy: userId as string
                },
                create: {
                    key: key,
                    value: String(value),
                    updatedBy: userId as string
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.log("[SETTINGS_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
