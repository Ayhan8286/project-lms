import { getAffiliate } from "@/actions/get-affiliate";
import { createAffiliate } from "@/actions/create-affiliate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CopyButton } from "./_components/CopyButton";

export default async function AffiliatePage() {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const affiliate = await getAffiliate();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Affiliate Dashboard</h1>

            {!affiliate ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Become an Affiliate</CardTitle>
                        <CardDescription>
                            Earn commissions by referring students to our courses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={async () => {
                            "use server";
                            await createAffiliate();
                        }}>
                            <Button type="submit">
                                Activate Affiliate Account
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Referral Link</CardTitle>
                            <CardDescription>
                                Share this link to earn commission.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-x-2">
                            <Input
                                value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?ref=${affiliate.code}`}
                                readOnly
                            />
                            <CopyButton value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?ref=${affiliate.code}`} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Earnings</CardTitle>
                            <CardDescription>
                                Lifetime earnings from referrals.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-600">
                                PKR {affiliate.earnings.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
