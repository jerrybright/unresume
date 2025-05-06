
import { ResumeDataType } from "@/types/resume";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export const generatePDF = async (resumeData: ResumeDataType) => {
  const element = document.getElementById("resume-preview");
  if (!element) return false;

  try {
    toast.info("Generating PDF...");
    
    // Add a class to help with PDF generation styling
    document.body.classList.add('pdf-generating');
    
    // Use A4 format
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true // Enable compression to reduce file size
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Get all page elements
    const pageElements = element.querySelectorAll(".resume-page");
    
    if (pageElements.length === 0) {
      toast.error("No content to generate PDF");
      document.body.classList.remove('pdf-generating');
      return false;
    }
    
    // For each page, create a canvas and add to PDF
    for (let i = 0; i < pageElements.length; i++) {
      const pageElement = pageElements[i] as HTMLElement;
      
      // If not the first page, add a new page to the PDF
      if (i > 0) {
        pdf.addPage();
      }
      
      try {
        // Force all elements to be visible for html2canvas
        const allElements = pageElement.querySelectorAll('*');
        allElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          }
        });
        
        // Use a lower scale for better performance and smaller file size
        // while still maintaining reasonable quality
        const canvas = await html2canvas(pageElement, {
          scale: 1.5, // Reduced scale for smaller file size (was 2)
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          allowTaint: true,
          onclone: (clonedDoc) => {
            // Make sure all elements are visible in the cloned document
            const clonedElement = clonedDoc.getElementById("resume-preview");
            if (clonedElement) {
              const elements = clonedElement.querySelectorAll('*');
              elements.forEach(el => {
                if (el instanceof HTMLElement) {
                  el.style.display = el.tagName === 'UL' ? 'block' : '';
                  el.style.opacity = '1';
                  el.style.visibility = 'visible';
                }
              });
            }
          }
        });
        
        // Convert canvas to image (further reduce quality for smaller files)
        const imgData = canvas.toDataURL("image/jpeg", 0.8); // Lower quality JPEG
        
        // Add image to PDF with proper scaling to fit page
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
      } catch (err) {
        console.error("Error rendering page", i, err);
      }
    }
    
    // Cleanup
    document.body.classList.remove('pdf-generating');
    
    // Set PDF properties for better metadata
    pdf.setProperties({
      title: `${resumeData.personalInfo.name || "Resume"}`,
      subject: "Resume",
      creator: "Resume Builder"
    });
    
    // Save PDF with optimized settings
    pdf.save(`${resumeData.personalInfo.name?.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`);
    toast.success("Resume downloaded successfully!");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
    document.body.classList.remove('pdf-generating');
    return false;
  }
};
