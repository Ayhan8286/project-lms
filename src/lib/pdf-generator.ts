import jsPDF from "jspdf";

export const generateChallan = (invoiceId: string, amount: number) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(4, 120, 87); // Emerald green
    doc.text("Al Huda Network", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Monthly Subscription Challan", 105, 30, { align: "center" });

    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice ID: ${invoiceId}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 56);
    doc.text(`Due Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 20, 62);

    // Bank Details
    doc.setLineWidth(0.5);
    doc.line(20, 70, 190, 70);

    doc.setFontSize(14);
    doc.text("Bank Details for Deposit", 20, 80);

    doc.setFontSize(10);
    doc.text("Bank Name: Meezan Bank", 20, 90);
    doc.text("Account Title: Al Huda Network Pvt Ltd", 20, 96);
    doc.text("Account Number: 0101-01010101-01", 20, 102);

    // Amount
    doc.rect(130, 85, 60, 25);
    doc.setFontSize(12);
    doc.text("Total Amount", 160, 92, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 38); // Red
    doc.text(`PKR ${amount.toLocaleString()}`, 160, 103, { align: "center" });

    // Footer Instructions
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text("Note: Please deposit this amount at any Meezan Bank branch.", 20, 130);
    doc.text("This is a computer-generated invoice and does not require a signature.", 20, 136);

    // Save
    doc.save(`Al-Huda-Challan-${invoiceId}.pdf`);
};
