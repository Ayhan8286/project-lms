import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";
import Link from "next/link";

const AdminReportsPage = async () => {
    const { userId } = await auth();

    if (!await isAdmin(userId)) {
        return redirect("/");
    }

    const reports = [
        {
            title: "Financial Report",
            description: "Export all invoice and payment data.",
            endpoint: "/api/admin/reports/finance",
            color: "text-emerald-600"
        },
        {
            title: "Attendance Report",
            description: "Export global student attendance records.",
            endpoint: "/api/admin/reports/attendance",
            color: "text-blue-600"
        },
        {
            title: "Performance Report",
            description: "Export student grades and quiz completion data.",
            endpoint: "/api/admin/reports/grades",
            color: "text-purple-600"
        }
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Reports Center</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <Card key={report.title} className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileSpreadsheet className={`h-5 w-5 ${report.color}`} />
                                {report.title}
                            </CardTitle>
                            <CardDescription>
                                {report.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={report.endpoint} target="_blank">
                                <Button className="w-full" variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download CSV
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default AdminReportsPage;
