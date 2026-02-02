"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface LiveClassroomProps {
    courseId: string;
    chapterId: string;
    userName: string;
}

export const LiveClassroom = ({ courseId, chapterId, userName }: LiveClassroomProps) => {
    // Unique room name based on course and chapter
    const roomName = `LMS_Live_${courseId}_${chapterId}`;
    const domain = "meet.jit.si";
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const recordAttendance = async () => {
            try {
                await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/attendance`);
            } catch (error) {
                console.log("Attendance error", error);
            }
        }

        recordAttendance();
    }, [courseId, chapterId]);

    return (
        <div className="relative w-full aspect-video bg-slate-900 rounded-md overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
            <iframe
                src={`https://${domain}/${roomName}?userInfo.displayName=${encodeURIComponent(userName)}&config.prejoinPageEnabled=false`}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};
