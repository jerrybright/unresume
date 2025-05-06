
import { ResumeDataType } from "@/types/resume";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (resumeData: ResumeDataType) => {
  const element = document.getElementById("resume-preview");
  if (!element) return;

  try {
    toast.info("Generating PDF...");
    
    // Use A4 format (mm for more precise control)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
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
      
      // Make all pages visible for proper rendering
      pageElements.forEach((p, idx) => {
        const page = p as HTMLElement;
        if (idx === i) {
          page.style.display = "block";
          page.style.visibility = "visible";
        } else {
          page.style.display = "none";
        }
      });
      
      try {
        // Use higher scale for better quality
        const canvas = await html2canvas(pageElement, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          logging: false,
          windowWidth: 794, // A4 width in pixels at 96 DPI
          backgroundColor: "#ffffff",
          allowTaint: true,
          onclone: (clonedDoc) => {
            // Make sure all content is visible in the cloned document
            const clonedElement = clonedDoc.getElementById("resume-preview");
            if (clonedElement) {
              const clonedPages = clonedElement.querySelectorAll(".resume-page");
              clonedPages.forEach((p, idx) => {
                const page = p as HTMLElement;
                if (idx === i) {
                  page.style.display = "block";
                  page.style.visibility = "visible";
                  // Make all child elements visible
                  Array.from(page.querySelectorAll("*")).forEach((el) => {
                    (el as HTMLElement).style.display = "block";
                  });
                } else {
                  page.style.display = "none";
                }
              });
            }
          }
        });
        
        const imgData = canvas.toDataURL("image/png", 1.0);
        
        // Add image ensuring it covers the full A4 page
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      } catch (err) {
        console.error("Error rendering page", i, err);
      }
    }
    
    // Restore all pages visibility
    pageElements.forEach((p) => {
      const page = p as HTMLElement;
      page.style.display = "block";
    });
    
    pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`);
    toast.success("Resume downloaded successfully!");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
    return false;
  }
};
