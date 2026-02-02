import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/format";

const ChildFeesPage = async ({
    params
}: {
    params: Promise<{ childId: string }>
}) => {
    const { userId } = await auth();
    const { childId } = await params;

    if (!userId) {
        return redirect("/");
    }

    // Verify parent
    const isParent = await db.parentStudent.findUnique({
        where: {
            parentId_studentId: {
                parentId: userId,
                studentId: childId,
            }
        }
    });

    if (!isParent) {
        return redirect("/");
    }

    // Fetch child details
    let childName = "Child";
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(childId);
        if (user) {
            childName = `${user.firstName} ${user.lastName}`;
        }
    } catch { }

    // Fetch Invoices
    const invoices = await db.invoice.findMany({
        where: {
            userId: childId,
        },
        include: {
            course: {
                select: { title: true }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href={`/parent/dashboard`}
                    className="flex items-center text-sm hover:opacity-75 transition mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-x-2">
                    <div className="bg-emerald-100 p-2 rounded-full">
                        <CreditCard className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Fee History: {childName}
                    </h1>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Item</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {invoices.length === 0 && (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={4} className="p-4 align-middle text-center text-muted-foreground">
                                        No fee records found.
                                    </td>
                                </tr>
                            )}
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">
                                        {format(new Date(invoice.createdAt), "PPP")}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {invoice.course?.title || "Fee"}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {formatPrice(invoice.amount)}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={
                                            invoice.status === "PAID"
                                                ? "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-500 text-emerald-50 hover:bg-emerald-500/80"
                                                : "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80"
                                        }>
                                            {invoice.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ChildFeesPage;
