
import { ResumeDataType } from "@/types/resume";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (resumeData: ResumeDataType) => {
  const element = document.getElementById("resume-preview");
  if (!element) return;

  try {
    toast.info("Generating PDF...");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Get all page elements
    const pageElements = element.querySelectorAll(".resume-page");
    
    if (pageElements.length === 0) {
      toast.error("No content to generate PDF");
      return false;
    }
    
    // For each page, create a canvas and add to PDF
    for (let i = 0; i < pageElements.length; i++) {
      const pageElement = pageElements[i] as HTMLElement;
      
      // If not the first page, add a new page to the PDF
      if (i > 0) {
        pdf.addPage();
      }
      
      // Temporarily make all pages visible for canvas generation
      const hiddenPages = Array.from(pageElements).filter((p, idx) => idx !== i) as HTMLElement[];
      hiddenPages.forEach(p => {
        p.style.display = "none";
      });
      pageElement.style.display = "block";
      
      try {
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 1200, // Set a consistent window width for rendering
        });
        
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      } catch (err) {
        console.error("Error rendering page", i, err);
      }
      
      // Restore visibility
      hiddenPages.forEach(p => {
        p.style.removeProperty("display");
      });
    }
    
    pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`);
    toast.success("Resume downloaded successfully!");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
    return false;
  }
};
