"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    category: string;
    progress?: number | null;
};

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    category,
    progress,
}: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="group hover:shadow-lg transition overflow-hidden border rounded-lg p-3 h-full bg-card"
            >
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-primary transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-1">
                                <BookOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    {typeof progress === "number" && (
                        <div className="mt-2">
                            <div className="h-2 w-full bg-slate-200 rounded-full">
                                <div
                                    className="h-full bg-sky-700 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {Math.round(progress)}% Complete
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </Link >
    )
}

