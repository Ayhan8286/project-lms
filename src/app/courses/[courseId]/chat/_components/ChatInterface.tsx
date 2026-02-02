"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2, Send, User, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface ChatInterfaceProps {
    conversationId: string;
    currentUserId: string;
    initialMessages: any[]; // Message[]
    otherUserName: string;
}

export const ChatInterface = ({
    conversationId,
    currentUserId,
    initialMessages,
    otherUserName
}: ChatInterfaceProps) => {
    const [messages, setMessages] = useState(initialMessages);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on updates
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`/api/messages?conversationId=${conversationId}`);
                if (res.data && Array.isArray(res.data)) {
                    setMessages(res.data);
                }
            } catch (error) {
                console.error("Polling error", error);
            }
        }, 3000); // 3 seconds

        return () => clearInterval(interval);
    }, [conversationId]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setIsLoading(true);
            const res = await axios.post("/api/messages", {
                content,
                conversationId,
            });

            setMessages((current) => [...current, res.data]);
            setContent("");
        } catch (error) {
            toast.error("Failed to send");
        } finally {
            setIsLoading(false);
        }
    };

    const onVideoCall = async () => {
        try {
            setIsLoading(true);
            const meetUrl = `https://meet.jit.si/${conversationId}`;
            const message = `Started a video call: ${meetUrl}`;

            const res = await axios.post("/api/messages", {
                content: message,
                conversationId,
            });

            setMessages((current) => [...current, res.data]);
            window.open(meetUrl, "_blank");
        } catch (error) {
            toast.error("Failed to start video call");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border">
            {/* Header */}
            <div className="p-4 bg-white dark:bg-slate-950 border-b flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{otherUserName}</h3>
                        <p className="text-xs text-muted-foreground">Instructor</p>
                    </div>
                </div>
                <Button onClick={onVideoCall} disabled={isLoading} variant="secondary" size="sm" className="hidden md:flex">
                    <Video className="h-4 w-4 mr-2" />
                    Start Video Call
                </Button>
                <Button onClick={onVideoCall} disabled={isLoading} variant="ghost" size="icon" className="md:hidden">
                    <Video className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        Start the conversation with {otherUserName}!
                    </div>
                )}
                {messages.map((msg) => {
                    const isOwn = msg.senderId === currentUserId;
                    // Check if message is a jitsi link
                    const isLink = msg.content.includes("https://meet.jit.si/");

                    return (
                        <div key={msg.id} className={cn(
                            "flex w-full mb-2",
                            isOwn ? "justify-end" : "justify-start"
                        )}>
                            <div className={cn(
                                "max-w-[70%] px-4 py-2 rounded-lg break-words",
                                isOwn ? "bg-sky-600 text-white rounded-br-none" : "bg-white border text-black rounded-bl-none"
                            )}>
                                {isLink ? (
                                    <div className="flex flex-col gap-2">
                                        <p className="underline text-sm break-all">
                                            Video Call Started
                                        </p>
                                        <a
                                            href={msg.content.split(": ")[1]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline text-xs bg-black/20 p-2 rounded hover:bg-black/30 w-fit"
                                        >
                                            Join Meeting
                                        </a>
                                    </div>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-950 border-t">
                <form onSubmit={onSubmit} className="flex gap-x-2">
                    <Input
                        disabled={isLoading}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Message ${otherUserName}...`}
                        className="flex-1 border-slate-300"
                    />
                    <Button disabled={isLoading || !content} type="submit" size="icon" className="bg-sky-600 ml-auto">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
};
