import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { CategoryForm } from "./_components/CategoryForm";

const AdminCategoriesPage = async () => {
    const { userId } = await auth();

    if (!await isAdmin(userId)) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        },
        include: {
            _count: {
                select: { courses: true }
            }
        }
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Subject Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-slate-100 p-4 rounded-lg dark:bg-slate-900 border">
                        <h2 className="font-semibold mb-4">Add New Subject</h2>
                        <CategoryForm />
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                    <div className="p-4 bg-slate-50 border-b dark:bg-slate-900 font-medium">
                        Existing Subjects ({categories.length})
                    </div>
                    <div className="divide-y">
                        {categories.map((category) => (
                            <div key={category.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                                <div>
                                    <p className="font-medium">{category.name}</p>
                                    <p className="text-xs text-muted-foreground">{category._count.courses} courses included</p>
                                </div>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategoriesPage;
