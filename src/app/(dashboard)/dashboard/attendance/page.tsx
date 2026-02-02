import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAttendance } from "@/actions/get-attendance";
import { CheckCircle } from "lucide-react";

const AttendancePage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const attendanceData = await getAttendance(userId);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Attendance Record</h1>

            <div className="border rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Course</th>
                            <th className="px-6 py-3">Session</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {attendanceData.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                    No attendance records found. Join a live class to get started!
                                </td>
                            </tr>
                        )}
                        {attendanceData.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td className="px-6 py-4 font-medium">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {record.courseTitle}
                                </td>
                                <td className="px-6 py-4">
                                    {record.chapterTitle}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AttendancePage;
