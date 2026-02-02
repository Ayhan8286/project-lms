"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, StickyNote, Download } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

interface NoteWidgetProps {
    courseId: string;
    chapterId: string;
}

export const NoteWidget = ({ courseId, chapterId }: NoteWidgetProps) => {
    const [notes, setNotes] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotes = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/notes`);
            const data = await res.json();
            setNotes(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (isOpen) fetchNotes();
    }, [isOpen, chapterId]);

    const onSave = async () => {
        if (!content.trim()) return;
        try {
            setIsLoading(true);
            const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, time: 0 }), // TODO: Get video time
            });
            if (res.ok) {
                toast.success("Note saved");
                setContent("");
                fetchNotes();
            }
        } catch (error) {
            toast.error("Failed to save");
        } finally {
            setIsLoading(false);
        }
    };

    const onDownload = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("My Course Notes", 20, 20);

        doc.setFontSize(12);
        let y = 40;

        if (notes.length === 0) {
            doc.text("No notes recorded.", 20, y);
        } else {
            notes.forEach((note, index) => {
                // Wrap text
                const text = `${index + 1}. ${note.content}`;
                const splitText = doc.splitTextToSize(text, 170);
                doc.text(splitText, 20, y);
                y += splitText.length * 7 + 5;
            });
        }

        doc.save("my-notes.pdf");
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="sm"
                className="fixed bottom-4 right-4 z-50 gap-x-2 shadow-lg"
            >
                <StickyNote className="h-4 w-4" />
                Notes
            </Button>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-slate-900 border shadow-xl rounded-lg flex flex-col max-h-[500px]">
            <div className="p-3 border-b flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-t-lg">
                <span className="font-semibold flex items-center gap-x-2">
                    <StickyNote className="h-4 w-4" />
                    My Notes
                </span>
                <div className="flex items-center gap-x-1">
                    <Button variant="ghost" size="icon" onClick={onDownload} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                    </Button>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground px-2">
                        ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {notes.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">
                        No notes yet. Capture your thoughts!
                    </div>
                )}
                {notes.map((note) => (
                    <div key={note.id} className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm border border-yellow-100 dark:border-yellow-900/30">
                        {note.content}
                    </div>
                ))}
            </div>

            <div className="p-3 border-t">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a note..."
                    className="w-full text-sm p-2 rounded border focus:ring-2 focus:ring-emerald-500 mb-2 bg-transparent"
                    rows={2}
                />
                <Button onClick={onSave} disabled={isLoading} size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Save className="h-3 w-3 mr-2" />
                    Save Note
                </Button>
            </div>
        </div>
    );
};
