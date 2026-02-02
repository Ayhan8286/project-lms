"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentReportsProps {
    data: {
        studentId: string;
        name: string;
        email: string;
        enrolledCourses: number;
        progress: number;
        avgQuizScore: number;
        avgAssignmentGrade: number;
    }[];
};

export const StudentReports = ({
    data
}: StudentReportsProps) => {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Student Performance Reports</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Student Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Enrolled Courses</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Avg. Progress</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Avg. Quiz Score</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Avg. Assignment Grade</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {data.length === 0 && (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={6} className="p-4 align-middle text-center text-muted-foreground">
                                        No student data available.
                                    </td>
                                </tr>
                            )}
                            {data.map((student) => (
                                <tr key={student.studentId} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{student.name}</td>
                                    <td className="p-4 align-middle">{student.email}</td>
                                    <td className="p-4 align-middle">{student.enrolledCourses}</td>
                                    <td className="p-4 align-middle">{student.progress}%</td>
                                    <td className="p-4 align-middle">{student.avgQuizScore || "-"}</td>
                                    <td className="p-4 align-middle">{student.avgAssignmentGrade || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};
