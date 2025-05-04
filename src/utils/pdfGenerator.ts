
import { ResumeDataType } from "@/types/resume";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (resumeData: ResumeDataType) => {
  const element = document.getElementById("resume-preview");
  if (!element) return;

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Get all page elements
    const pageElements = element.querySelectorAll(".resume-page");
    
    // For each page, create a canvas and add to PDF
    for (let i = 0; i < pageElements.length; i++) {
      const pageElement = pageElements[i] as HTMLElement;
      
      // If not the first page, add a new page to the PDF
      if (i > 0) {
        pdf.addPage();
      }
      
      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    }
    
    pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
