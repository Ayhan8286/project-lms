import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { format } from "date-fns";
import { InvoiceActions } from "./_components/InvoiceActions";
import { Badge } from "@/components/ui/badge";
import { clerkClient } from "@clerk/nextjs/server";

const AdminInvoicesPage = async () => {
    const { userId } = await auth();

    if (!await isAdmin(userId)) {
        return redirect("/");
    }

    const invoices = await db.invoice.findMany({
        include: {
            course: {
                select: { title: true }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // Helper to get user email (optimally we'd cache or batch this, but for Admin UI this is acceptable)
    const client = await clerkClient();
    const invoicesWithUser = await Promise.all(invoices.map(async (inv) => {
        let email = "Unknown";
        try {
            const user = await client.users.getUser(inv.userId);
            email = user.emailAddresses[0]?.emailAddress || "Unknown";
        } catch { }
        return {
            ...inv,
            userEmail: email
        }
    }));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Fee Management</h1>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Course</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {invoicesWithUser.length === 0 && (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={6} className="p-4 align-middle text-center text-muted-foreground">
                                        No invoices found.
                                    </td>
                                </tr>
                            )}
                            {invoicesWithUser.map((invoice) => (
                                <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle">
                                        {format(new Date(invoice.createdAt), "PP")}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">{invoice.userId}</span>
                                            <span>{invoice.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {invoice.course?.title}
                                    </td>
                                    <td className="p-4 align-middle font-medium">
                                        {formatPrice(invoice.amount)}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={
                                            invoice.status === "PAID" ? "default" :
                                                invoice.status === "VOID" ? "destructive" : "secondary"
                                        }>
                                            {invoice.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <InvoiceActions invoiceId={invoice.id} currentStatus={invoice.status} />
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

export default AdminInvoicesPage;
