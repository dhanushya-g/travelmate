import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

interface ItineraryPdfExportProps {
  itinerary: {
    destination: string;
    country?: string;
    summary: string;
    days: Array<{
      day: number;
      title: string;
      activities: Array<{
        time: string;
        activity: string;
        description: string;
        duration: string;
        cost: string;
        tips?: string;
      }>;
      meals: {
        breakfast: string;
        lunch: string;
        dinner: string;
      };
      hotel: string;
    }>;
    totalEstimatedCost: string;
    packingTips: string[];
    localTips: string[];
  };
  startDate?: string;
  endDate?: string;
}

export const ItineraryPdfExport = ({ itinerary, startDate, endDate }: ItineraryPdfExportProps) => {
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const generatePdf = async () => {
    setExporting(true);
    
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      const checkPageBreak = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
        }
      };

      // Header
      pdf.setFillColor(37, 99, 235); // Primary blue
      pdf.rect(0, 0, pageWidth, 45, "F");
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${itinerary.destination} Trip`, margin, 25);
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const dateText = startDate && endDate 
        ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
        : `${itinerary.days.length} days`;
      pdf.text(`${dateText} • ${itinerary.totalEstimatedCost}`, margin, 35);
      
      yPos = 55;
      
      // Summary
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "italic");
      const summaryLines = pdf.splitTextToSize(itinerary.summary, pageWidth - margin * 2);
      pdf.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 5 + 10;

      // Day-by-day itinerary
      itinerary.days.forEach((day) => {
        checkPageBreak(50);
        
        // Day header
        pdf.setFillColor(240, 245, 255);
        pdf.roundedRect(margin - 5, yPos - 5, pageWidth - margin * 2 + 10, 12, 2, 2, "F");
        
        pdf.setTextColor(37, 99, 235);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Day ${day.day}: ${day.title}`, margin, yPos + 4);
        yPos += 15;
        
        // Hotel
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text(`🏨 ${day.hotel}`, margin, yPos);
        yPos += 8;

        // Activities
        day.activities.forEach((activity) => {
          checkPageBreak(25);
          
          pdf.setTextColor(37, 99, 235);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${activity.time}`, margin, yPos);
          
          pdf.setTextColor(40, 40, 40);
          pdf.text(` - ${activity.activity}`, margin + 20, yPos);
          yPos += 5;
          
          pdf.setTextColor(80, 80, 80);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          const descLines = pdf.splitTextToSize(activity.description, pageWidth - margin * 2 - 10);
          pdf.text(descLines, margin + 5, yPos);
          yPos += descLines.length * 4;
          
          pdf.setTextColor(120, 120, 120);
          pdf.setFontSize(8);
          pdf.text(`⏱ ${activity.duration} • 💰 ${activity.cost}`, margin + 5, yPos);
          yPos += 6;

          if (activity.tips) {
            pdf.setTextColor(22, 163, 74);
            pdf.setFontSize(8);
            const tipLines = pdf.splitTextToSize(`💡 ${activity.tips}`, pageWidth - margin * 2 - 10);
            pdf.text(tipLines, margin + 5, yPos);
            yPos += tipLines.length * 4;
          }
          yPos += 3;
        });

        // Meals
        checkPageBreak(20);
        pdf.setFillColor(255, 247, 237);
        pdf.roundedRect(margin - 2, yPos - 2, pageWidth - margin * 2 + 4, 16, 2, 2, "F");
        
        pdf.setTextColor(194, 65, 12);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.text("Dining:", margin, yPos + 4);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80);
        pdf.text(`🍳 ${day.meals.breakfast} • 🥗 ${day.meals.lunch} • 🍽 ${day.meals.dinner}`, margin + 15, yPos + 4);
        yPos += 20;
      });

      // Tips section
      checkPageBreak(60);
      yPos += 5;
      
      // Packing tips
      pdf.setFillColor(240, 253, 244);
      pdf.roundedRect(margin - 5, yPos - 5, (pageWidth - margin * 2) / 2 - 5, 50, 2, 2, "F");
      
      pdf.setTextColor(22, 101, 52);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("🧳 Packing Tips", margin, yPos + 4);
      yPos += 10;
      
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      itinerary.packingTips.slice(0, 5).forEach((tip) => {
        const tipLines = pdf.splitTextToSize(`• ${tip}`, (pageWidth - margin * 2) / 2 - 15);
        pdf.text(tipLines, margin, yPos);
        yPos += tipLines.length * 3.5;
      });

      // Local tips (right column)
      let localY = yPos - 10 - (itinerary.packingTips.slice(0, 5).length * 3.5);
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(pageWidth / 2 + 5, localY - 15, (pageWidth - margin * 2) / 2 - 5, 50, 2, 2, "F");
      
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("📍 Local Tips", pageWidth / 2 + 10, localY - 6);
      localY += 4;
      
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      itinerary.localTips.slice(0, 5).forEach((tip) => {
        const tipLines = pdf.splitTextToSize(`• ${tip}`, (pageWidth - margin * 2) / 2 - 15);
        pdf.text(tipLines, pageWidth / 2 + 10, localY);
        localY += tipLines.length * 3.5;
      });

      // Footer
      const finalY = Math.max(yPos, localY) + 15;
      checkPageBreak(20);
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.text(`Generated by TravelMate • ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

      // Save
      pdf.save(`${itinerary.destination.replace(/\s+/g, "-")}-itinerary.pdf`);
      
      toast({
        title: "PDF exported!",
        description: "Your itinerary has been downloaded.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Please try again.",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={generatePdf} disabled={exporting} className="gap-2">
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          Export PDF
        </>
      )}
    </Button>
  );
};
