
import { ResumeDataType } from "@/types/resume";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const generatePDF = async (resumeData: ResumeDataType) => {
  const element = document.getElementById("resume-preview");
  if (!element) return;

  try {
    toast.info("Generating PDF...");
    
    // Add a class to help with PDF generation styling
    document.body.classList.add('pdf-generating');
    
    // Use A4 format (mm for more precise control)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: false // Disable compression for better text quality
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

      // Before rendering, ensure all styles are properly applied
      const allElements = pageElement.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Make sure all elements are visible
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          
          // Ensure proper display for flex elements
          if (window.getComputedStyle(el).display.includes('flex')) {
            el.style.display = 'flex';
          }
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
          foreignObjectRendering: true, // Try to use foreignObject for better text rendering
          onclone: (clonedDoc) => {
            // Make sure all content is visible in the cloned document
            const clonedElement = clonedDoc.getElementById("resume-preview");
            if (clonedElement) {
              const clonedPage = clonedDoc.querySelectorAll(".resume-page")[i] as HTMLElement;
              if (clonedPage) {
                clonedPage.style.display = "block";
                clonedPage.style.visibility = "visible";
                clonedPage.style.position = "relative";
                clonedPage.style.overflow = "visible";
                
                // Ensure proper styling for all elements
                const allElements = clonedPage.querySelectorAll('*');
                allElements.forEach(el => {
                  if (el instanceof HTMLElement) {
                    // Make sure all elements are visible
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    
                    // Special handling for flex containers
                    if (window.getComputedStyle(el).display.includes('flex')) {
                      el.style.display = 'flex';
                    }
                    
                    // Fix for list items
                    if (el.tagName === 'LI') {
                      el.style.display = 'list-item';
                    }
                    
                    // Fix for bullet lists
                    if (el.tagName === 'UL') {
                      el.style.listStyleType = 'disc';
                      el.style.paddingLeft = '1.5rem';
                    }
                  }
                });
              }
            }
          }
        });
        
        const imgData = canvas.toDataURL("image/png", 1.0);
        
        // Add image ensuring it covers the full A4 page
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      } catch (err) {
        console.error("Error rendering page", i, err);
        toast.error(`Error rendering page ${i+1}`);
      }
    }
    
    // Cleanup PDF generation class
    document.body.classList.remove('pdf-generating');
    
    pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`);
    toast.success("Resume downloaded successfully!");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
    document.body.classList.remove('pdf-generating');
    return false;
  }
};
