"use client";

import { FileText, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateChallan } from "@/lib/pdf-generator";
import { Invoice, Subscription } from "@prisma/client";
import { createInvoice } from "@/actions/create-invoice";
import { useState } from "react";
import toast from "react-hot-toast";

interface BillingClientProps {
    subscription: Subscription | null;
    invoices: Invoice[];
}

export const BillingClient = ({
    subscription,
    invoices
}: BillingClientProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onGenerate = async () => {
        try {
            setIsLoading(true);
            const invoice = await createInvoice(1500); // Fixed amount for now

            if ("error" in invoice) {
                toast.error(invoice.error as string);
                return;
            }

            generateChallan(invoice.id, invoice.amount);
            toast.success("Challan generated");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const isActive = subscription?.isActive;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Subscription Status Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <FileText className="h-24 w-24 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Current Status</h2>

                {isActive ? (
                    <div className="flex items-center gap-x-2 mb-6">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <span className="text-lg font-medium text-emerald-500">Active</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-x-2 mb-6">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <span className="text-lg font-medium text-amber-500">Payment Pending</span>
                    </div>
                )}


                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-medium text-foreground">Monthly Access</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount Due</span>
                        <span className="font-bold text-primary text-lg">PKR 1,500</span>
                    </div>
                    {subscription?.expiresAt && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Expires On</span>
                            <span className="font-medium text-foreground">
                                {subscription.expiresAt.toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>

                <Button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="w-full gap-x-2 bg-emerald-600 hover:bg-emerald-700"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    Generate Monthly Challan
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                    Download your challan and pay at any aligned bank branch.
                </p>
            </div>

            {/* Payment Instructions */}
            <div className="bg-muted/30 border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">How to Pay</h2>
                <ol className="space-y-4 list-decimal list-inside text-sm text-muted-foreground">
                    <li className="leading-relaxed">Click "Generate Monthly Challan" to download your PDF invoice.</li>
                    <li className="leading-relaxed">Print the challan or save it on your mobile.</li>
                    <li className="leading-relaxed">Visit any <strong>Meezan Bank</strong> or <strong>HBL</strong> branch.</li>
                    <li className="leading-relaxed">Deposit the amount (PKR 1,500) using the generated generated Reference ID.</li>
                    <li className="leading-relaxed">Your subscription will be activated within 24 hours of payment.</li>
                </ol>
            </div>

            {/* History Table - Moved inside grid if needed, or outside. Original design had it outside. Use Col Span if inside or move out. */}
            <div className="md:col-span-2 border border-border rounded-xl bg-card overflow-hidden mt-6">
                <div className="p-4 border-b border-border bg-muted/20">
                    <h3 className="font-semibold text-foreground">Payment History</h3>
                </div>
                {invoices.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No payment history found.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-3">Invoice ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-muted/50 transition-colors bg-card text-foreground">
                                    <td className="px-6 py-4 font-medium text-xs font-mono">{invoice.id.slice(0, 8)}...</td>
                                    <td className="px-6 py-4">{invoice.createdAt.toLocaleDateString()}</td>
                                    <td className="px-6 py-4">PKR {invoice.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {invoice.status === "PAID" ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <CheckCircle className="h-3 w-3 mr-1" /> Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                {invoice.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => generateChallan(invoice.id, invoice.amount)}
                                        >
                                            <Download className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
