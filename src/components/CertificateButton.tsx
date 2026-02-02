"use client";

import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import jsPDF from "jspdf";

interface CertificateButtonProps {
    courseName: string;
    studentName: string;
}

export const CertificateButton = ({ courseName, studentName }: CertificateButtonProps) => {

    const onDownload = () => {
        const doc = new jsPDF({
            orientation: "landscape",
        });

        // Add sleek background or border
        doc.setLineWidth(10);
        doc.setDrawColor(79, 70, 229); // Indigo 600
        doc.rect(0, 0, 297, 210);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.setTextColor(51, 65, 85); // Slate 700
        doc.text("Certificate of Completion", 148.5, 60, { align: "center" });

        doc.setFontSize(20);
        doc.setFont("helvetica", "normal");
        doc.text("This is to certify that", 148.5, 90, { align: "center" });

        doc.setFontSize(30);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(79, 70, 229);
        doc.text(studentName, 148.5, 110, { align: "center" });

        doc.setFontSize(20);
        doc.setTextColor(51, 65, 85);
        doc.setFont("helvetica", "normal");
        doc.text("has successfully completed the course", 148.5, 130, { align: "center" });

        doc.setFontSize(25);
        doc.setFont("helvetica", "bold");
        doc.text(courseName, 148.5, 150, { align: "center" });

        doc.setFontSize(15);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100);
        doc.text(`Issued on ${new Date().toLocaleDateString()}`, 148.5, 180, { align: "center" });
        doc.text("Al Huda Network", 148.5, 190, { align: "center" });

        doc.save(`${courseName}-Certificate.pdf`);
    };

    return (
        <Button
            onClick={onDownload}
            className="w-full bg-indigo-600 hover:bg-indigo-700 gap-x-2 mt-4"
        >
            <Award className="h-5 w-5" />
            Download Certificate
        </Button>
    );
};
