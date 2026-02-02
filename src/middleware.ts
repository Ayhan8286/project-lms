import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
    "/",
    "/search",
    "/api/uploadthing",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks(.*)",
    "/api/health"
]);

import { rateLimiter } from "./lib/rate-limit";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!rateLimiter(ip)) {
        return new NextResponse("Too Many Requests", { status: 429 });
    }

    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
