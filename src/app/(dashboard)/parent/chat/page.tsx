import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getChildTeachers } from "@/actions/get-child-teachers";
import Link from "next/link";
import { MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StartChatButton } from "./_components/StartChatButton";

const ParentChatPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const teachers = await getChildTeachers(userId);

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-x-2">
                    <div className="bg-indigo-100 p-2 rounded-full">
                        <MessageCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Message Teachers
                    </h1>
                </div>
                <p className="text-muted-foreground mt-2">
                    Contact the instructors of your children&apos;s courses.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.length === 0 && (
                    <div className="col-span-full border rounded-lg p-10 flex flex-col items-center justify-center text-muted-foreground">
                        <MessageCircle className="h-10 w-10 mb-4" />
                        <p>No instructors found yet.</p>
                        <p className="text-sm">Enroll your children in courses to see instructors here.</p>
                    </div>
                )}
                {teachers.map((teacher) => (
                    <div key={teacher.teacherId} className="border rounded-lg p-6 bg-white dark:bg-slate-950 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-x-4">
                            {teacher.imageUrl ? (
                                <img
                                    src={teacher.imageUrl}
                                    alt={teacher.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-slate-500" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold">{teacher.name}</h3>
                                <p className="text-xs text-muted-foreground">Instructor: {teacher.courseName}</p>
                            </div>
                        </div>

                        {teacher.conversationId ? (
                            <Link href={`/parent/chat/${teacher.conversationId}`} className="w-full">
                                <Button className="w-full">
                                    Continue Chat
                                </Button>
                            </Link>
                        ) : (
                            <StartChatButton teacherId={teacher.teacherId} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ParentChatPage;
