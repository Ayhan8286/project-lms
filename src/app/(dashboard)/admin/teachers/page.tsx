import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin"; // Reuse auth check
import { User, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

const AdminTeachersPage = async () => {
    const { userId } = await auth();

    if (!await isAdmin(userId)) {
        return redirect("/");
    }

    // Fetch Teacher Profiles
    const profiles = await db.teacherProfile.findMany({
        orderBy: {
            // No createdAt in TeacherProfile schema shown earlier?
            // Let's check schema quick or just list.
            userId: "desc", // Fallback sort
        }
    });

    const client = await clerkClient();

    const teachers = await Promise.all(
        profiles.map(async (profile) => {
            try {
                const user = await client.users.getUser(profile.userId);

                // Count courses
                const courseCount = await db.course.count({
                    where: { userId: profile.userId }
                });

                return {
                    profile,
                    user,
                    courseCount,
                };
            } catch (error) {
                return null;
            }
        })
    );

    const validTeachers = teachers.filter((t): t is NonNullable<typeof t> => t !== null);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Teacher Management</h1>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Instructor</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Stats</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {validTeachers.length === 0 && (
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td colSpan={4} className="p-4 align-middle text-center text-muted-foreground">
                                        No instructors found.
                                    </td>
                                </tr>
                            )}
                            {validTeachers.map(({ profile, user, courseCount }) => (
                                <tr key={profile.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">
                                        <div className="flex items-center gap-2">
                                            {user.imageUrl ? (
                                                <img src={user.imageUrl} alt="Avatar" className="h-8 w-8 rounded-full" />
                                            ) : (
                                                <User className="h-8 w-8 p-1 bg-slate-100 rounded-full" />
                                            )}
                                            <div className="flex flex-col">
                                                <span>{user.firstName} {user.lastName}</span>
                                                <span className="text-xs text-muted-foreground truncate w-40">{profile.bio || "No bio"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col text-sm">
                                            <span>{user.emailAddresses[0]?.emailAddress}</span>
                                            {profile.websiteUrl && (
                                                <Link href={profile.websiteUrl} target="_blank" className="text-blue-500 hover:underline text-xs">
                                                    Website
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-1.5">
                                            <GraduationCap className="h-4 w-4 text-emerald-500" />
                                            <span>{courseCount} Courses</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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

export default AdminTeachersPage;
