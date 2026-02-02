import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminAnalytics } from "@/actions/get-admin-analytics";
import { isAdmin } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { DollarSign, CreditCard, TrendingUp } from "lucide-react";

const AdminAnalyticsPage = async () => {
    const { userId } = await auth();

    if (!await isAdmin(userId)) {
        return redirect("/");
    }

    const { data, totalRevenue, totalSales } = await getAdminAnalytics();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Platform Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Sales
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalSales}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Top Performing Courses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.length === 0 && (
                            <p className="text-muted-foreground text-sm">No sales data available yet.</p>
                        )}
                        <ul className="space-y-4">
                            {data.map((item) => (
                                <li key={item.name} className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">{item.name}</span>
                                    <span className="text-sm font-bold">{formatPrice(item.total)}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminAnalyticsPage;
