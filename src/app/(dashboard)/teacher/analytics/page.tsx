import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";
import { getStudentAnalytics } from "@/actions/get-student-analytics";
import { DataCard } from "./_components/DataCard";
import { Chart } from "./_components/Chart";
import { StudentReports } from "./_components/StudentReports";

const AnalyticsPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        data,
        totalRevenue,
        totalSales,
    } = await getAnalytics(userId);

    const studentData = await getStudentAnalytics(userId);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Financial Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label="Total Revenue"
                    value={totalRevenue}
                    shouldFormat
                />
                <DataCard
                    label="Total Sales"
                    value={totalSales}
                />
            </div>
            <Chart
                data={data}
            />

            <div className="mt-10">
                <h1 className="text-2xl font-bold mb-4">Student Reports</h1>
                <StudentReports data={studentData} />
            </div>
        </div>
    );
}

export default AnalyticsPage;
