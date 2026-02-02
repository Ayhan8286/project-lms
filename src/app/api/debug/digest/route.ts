import { generateDigest } from "@/lib/mail/digest";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const html = await generateDigest(userId);
        return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    } catch {
        return new NextResponse("Error", { status: 500 });
    }
}
