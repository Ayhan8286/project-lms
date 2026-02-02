import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { User, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const AdminStudentsPage = async () => {
    const { userId } = await auth();

    if (!await isAdmin(userId)) {
        return redirect("/");
    }

    const client = await clerkClient();

    // Fetch users (Clerk usually paginates, fetching first 50/100 here)
    const response = await client.users.getUserList({
        limit: 50,
    });

    // userList in newer Clerk SDKs might be response.data or just response
    const users = response.data || response;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Student Management</h1>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Joined</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users.map((user: any) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium flex items-center gap-2">
                                        {user.imageUrl ? (
                                            <img src={user.imageUrl} alt="Avatar" className="h-8 w-8 rounded-full" />
                                        ) : (
                                            <User className="h-8 w-8 p-1 bg-slate-100 rounded-full" />
                                        )}
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {user.emailAddresses[0]?.emailAddress}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {format(new Date(user.createdAt), "PPP")}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            {/* We needs a Client Component for 'Delete' to handle confirmation/execution */}
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

export default AdminStudentsPage;
