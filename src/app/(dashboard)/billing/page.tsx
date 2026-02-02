import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BillingClient } from "./_components/BillingClient";

export default async function BillingPage() {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const subscription = await db.subscription.findUnique({
        where: {
            userId,
        }
    });

    const invoices = await db.invoice.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">My Subscription</h1>
                <p className="text-muted-foreground mt-2">Manage your Al Huda Network subscription and payments.</p>
            </div>

            <BillingClient
                subscription={subscription}
                invoices={invoices}
            />
        </div>
    );
}
