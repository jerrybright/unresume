
import { ResumeDataType } from "@/types/resume";
import { formatDate } from "@/utils/formatters";
import { useEffect, useRef, useState } from "react";

interface ResumePreviewProps {
  data: ResumeDataType;
}

const ResumePreview = ({ data }: ResumePreviewProps) => {
  const {
    personalInfo,
    summary,
    experience,
    projects,
    education,
    certifications,
    skills
  } = data;

  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number>(1);
  
  useEffect(() => {
    // Function to render the resume content with proper pagination
    const renderResume = () => {
      if (!containerRef.current) return;
      
      // Clear existing content
      const container = containerRef.current;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // Create first page
      const firstPage = document.createElement('div');
      firstPage.className = 'resume-page';
      container.appendChild(firstPage);
      
      let currentPage = firstPage;
      let currentContentDiv = document.createElement('div');
      currentContentDiv.className = 'resume-content';
      currentPage.appendChild(currentContentDiv);
      
      // Maximum content height per page (A4 height minus padding)
      const maxContentHeight = 257; // in mm (297mm - 40mm for padding)
      let currentContentHeight = 0;
      
      // Function to create a new page when needed
      const createNewPage = () => {
        // Create a new page
        const newPage = document.createElement('div');
        newPage.className = 'resume-page';
        container.appendChild(newPage);
        
        // Update current page reference
        currentPage = newPage;
        currentContentDiv = document.createElement('div');
        currentContentDiv.className = 'resume-content';
        currentPage.appendChild(currentContentDiv);
        
        // Reset current height for the new page
        currentContentHeight = 0;
      };
      
      // Function to check if content would overflow and create new page if needed
      const checkOverflowAndCreatePage = (elementHeight: number) => {
        if (currentContentHeight + elementHeight > maxContentHeight) {
          createNewPage();
          return true;
        }
        return false;
      };
      
      // Function to add section to current page and manage pagination
      const addSectionToPage = (section: HTMLElement, estimatedHeight: number, isSectionStart: boolean = true) => {
        // If this is a new section and it doesn't fit on current page, create new page
        if (isSectionStart && currentContentHeight > 0 && currentContentHeight + estimatedHeight > maxContentHeight) {
          createNewPage();
          currentContentHeight = 0;
        }
        
        // Add the section to the current content div
        currentContentDiv.appendChild(section);
        currentContentHeight += estimatedHeight;
      };
      
      // Add header/contact info (always at the top of the first page)
      const headerSection = document.createElement('div');
      headerSection.className = 'resume-section header-section';
      
      if (personalInfo.name) {
        const nameDiv = document.createElement('div');
        nameDiv.className = 'resume-name';
        nameDiv.textContent = personalInfo.name.toUpperCase();
        headerSection.appendChild(nameDiv);
        
        if (personalInfo) {
          const contactDiv = document.createElement('div');
          contactDiv.className = 'resume-contact';
          
          let contactHTML = '';
          
          if (personalInfo.phone) {
            contactHTML += `<span>${personalInfo.phone}</span>`;
          }
          
          if (personalInfo.phone && personalInfo.location) {
            contactHTML += `<span> • </span>`;
          }
          
          if (personalInfo.location) {
            contactHTML += `<span>${personalInfo.location}</span>`;
          }
          
          if ((personalInfo.phone || personalInfo.location) && 
              (personalInfo.portfolio || personalInfo.linkedin || personalInfo.email)) {
            contactHTML += `<br />`;
          }
          
          if (personalInfo.portfolio) {
            contactHTML += `<span>Portfolio: ${personalInfo.portfolio}</span>`;
          }
          
          if (personalInfo.portfolio && personalInfo.linkedin) {
            contactHTML += `<span> • </span>`;
          }
          
          if (personalInfo.linkedin) {
            contactHTML += `<span>LinkedIn/${personalInfo.linkedin}</span>`;
          }
          
          if ((personalInfo.portfolio || personalInfo.linkedin) && personalInfo.email) {
            contactHTML += `<span> • </span>`;
          }
          
          if (personalInfo.email) {
            contactHTML += `<span>${personalInfo.email}</span>`;
          }
          
          contactDiv.innerHTML = contactHTML;
          headerSection.appendChild(contactDiv);
        }
        
        addSectionToPage(headerSection, 20);
      }
      
      // Add summary section
      if (summary) {
        const summarySection = document.createElement('div');
        summarySection.className = 'resume-section';
        
        const summaryTitle = document.createElement('div');
        summaryTitle.className = 'resume-section-title';
        summaryTitle.textContent = 'SUMMARY';
        summarySection.appendChild(summaryTitle);
        
        const summaryContent = document.createElement('div');
        summaryContent.textContent = summary;
        summarySection.appendChild(summaryContent);
        
        // Estimate height based on text length
        const summaryHeight = 10 + Math.ceil(summary.length / 100) * 5;
        addSectionToPage(summarySection, summaryHeight);
      }
      
      // Add experience section with improved pagination
      if (experience.length > 0) {
        let expSectionTitle = 'EXPERIENCE';
        let experienceSection = document.createElement('div');
        experienceSection.className = 'resume-section';
        
        const expTitle = document.createElement('div');
        expTitle.className = 'resume-section-title';
        expTitle.textContent = expSectionTitle;
        experienceSection.appendChild(expTitle);
        
        let totalExpItems = 0; // Track how many experience items we've added
        
        experience.forEach((exp) => {
          // Create experience item
          const expItem = document.createElement('div');
          expItem.className = 'resume-item';
          
          const headerDiv = document.createElement('div');
          headerDiv.className = 'flex justify-between';
          
          const titleDiv = document.createElement('div');
          titleDiv.className = 'font-bold';
          titleDiv.textContent = `${exp.title} ${exp.company ? `(${exp.company})` : ''}`;
          headerDiv.appendChild(titleDiv);
          
          const dateDiv = document.createElement('div');
          dateDiv.className = 'text-right';
          dateDiv.textContent = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
          headerDiv.appendChild(dateDiv);
          
          expItem.appendChild(headerDiv);
          
          const locationDiv = document.createElement('div');
          locationDiv.className = 'text-sm italic mb-1';
          locationDiv.textContent = `${exp.location}${exp.isRemote ? ', Remote' : ''}`;
          expItem.appendChild(locationDiv);
          
          // Add bullet points if available
          if (exp.bulletPoints && exp.bulletPoints.length > 0) {
            const bulletsList = document.createElement('ul');
            bulletsList.className = 'list-disc pl-5 text-sm';
            
            exp.bulletPoints.filter(Boolean).forEach(point => {
              const listItem = document.createElement('li');
              listItem.textContent = point;
              bulletsList.appendChild(listItem);
            });
            
            expItem.appendChild(bulletsList);
          }
          
          // Calculate height based on content
          const itemHeight = 15 + (exp.bulletPoints?.filter(Boolean).length || 0) * 5;
          
          // Check if adding this item would cause overflow
          if (currentContentHeight + itemHeight > maxContentHeight && totalExpItems > 0) {
            // Add the current experience section to the page
            addSectionToPage(experienceSection, 0);
            
            // Create a new page and section for the next items
            createNewPage();
            currentContentHeight = 0;
            
            // Update section title for continuation
            expSectionTitle = 'EXPERIENCE (Continued)';
            
            // Create new section
            experienceSection = document.createElement('div');
            experienceSection.className = 'resume-section';
            
            const contTitle = document.createElement('div');
            contTitle.className = 'resume-section-title';
            contTitle.textContent = expSectionTitle;
            experienceSection.appendChild(contTitle);
          }
          
          // Add this experience item to the current section
          experienceSection.appendChild(expItem);
          totalExpItems++;
          currentContentHeight += itemHeight;
        });
        
        // Add the final experience section if there's anything left
        if (experienceSection.children.length > 1) {
          addSectionToPage(experienceSection, 0);
        }
      }
      
      // Add projects section with similar pagination logic
      if (projects.length > 0) {
        let projSectionTitle = 'PROJECTS';
        let projectsSection = document.createElement('div');
        projectsSection.className = 'resume-section';
        
        const projTitle = document.createElement('div');
        projTitle.className = 'resume-section-title';
        projTitle.textContent = projSectionTitle;
        projectsSection.appendChild(projTitle);
        
        let totalProjItems = 0; // Track how many project items we've added
        
        projects.forEach((project) => {
          const projItem = document.createElement('div');
          projItem.className = 'resume-item';
          
          const titleDiv = document.createElement('div');
          titleDiv.className = 'font-bold';
          titleDiv.textContent = project.title;
          projItem.appendChild(titleDiv);
          
          if (project.description) {
            const descDiv = document.createElement('div');
            descDiv.className = 'text-sm italic mb-1';
            descDiv.textContent = project.description;
            projItem.appendChild(descDiv);
          }
          
          if (project.bulletPoints && project.bulletPoints.length > 0) {
            const bulletsList = document.createElement('ul');
            bulletsList.className = 'list-disc pl-5 text-sm';
            
            project.bulletPoints.filter(Boolean).forEach(point => {
              const listItem = document.createElement('li');
              listItem.textContent = point;
              bulletsList.appendChild(listItem);
            });
            
            projItem.appendChild(bulletsList);
          }
          
          // Calculate height based on content
          const itemHeight = 15 + (project.bulletPoints?.filter(Boolean).length || 0) * 5 + 
                            (project.description ? 5 : 0);
          
          // Check if adding this item would cause overflow
          if (currentContentHeight + itemHeight > maxContentHeight && totalProjItems > 0) {
            // Add the current projects section to the page
            addSectionToPage(projectsSection, 0);
            
            // Create a new page and section for the next items
            createNewPage();
            currentContentHeight = 0;
            
            // Update section title for continuation
            projSectionTitle = 'PROJECTS (Continued)';
            
            // Create new section
            projectsSection = document.createElement('div');
            projectsSection.className = 'resume-section';
            
            const contTitle = document.createElement('div');
            contTitle.className = 'resume-section-title';
            contTitle.textContent = projSectionTitle;
            projectsSection.appendChild(contTitle);
          }
          
          // Add this project item to the current section
          projectsSection.appendChild(projItem);
          totalProjItems++;
          currentContentHeight += itemHeight;
        });
        
        // Add the final projects section if there's anything left
        if (projectsSection.children.length > 1) {
          addSectionToPage(projectsSection, 0);
        }
      }
      
      // Add education section with pagination
      if (education.length > 0) {
        let eduSectionTitle = 'EDUCATION';
        let educationSection = document.createElement('div');
        educationSection.className = 'resume-section';
        
        const eduTitle = document.createElement('div');
        eduTitle.className = 'resume-section-title';
        eduTitle.textContent = eduSectionTitle;
        educationSection.appendChild(eduTitle);
        
        let totalEduItems = 0; // Track how many education items we've added
        
        education.forEach(edu => {
          const eduItem = document.createElement('div');
          eduItem.className = 'resume-item';
          
          const headerDiv = document.createElement('div');
          headerDiv.className = 'flex justify-between';
          
          const degreeDiv = document.createElement('div');
          degreeDiv.className = 'font-bold';
          degreeDiv.textContent = edu.degree;
          headerDiv.appendChild(degreeDiv);
          
          const dateDiv = document.createElement('div');
          dateDiv.className = 'text-right';
          dateDiv.textContent = `${edu.startYear} - ${edu.endYear}`;
          headerDiv.appendChild(dateDiv);
          
          eduItem.appendChild(headerDiv);
          
          const instDiv = document.createElement('div');
          instDiv.className = 'text-sm';
          instDiv.textContent = edu.institution;
          eduItem.appendChild(instDiv);
          
          // Fixed height for education items
          const itemHeight = 12;
          
          // Check if adding this item would cause overflow
          if (currentContentHeight + itemHeight > maxContentHeight && totalEduItems > 0) {
            // Add the current education section to the page
            addSectionToPage(educationSection, 0);
            
            // Create a new page and section for the next items
            createNewPage();
            currentContentHeight = 0;
            
            // Update section title for continuation
            eduSectionTitle = 'EDUCATION (Continued)';
            
            // Create new section
            educationSection = document.createElement('div');
            educationSection.className = 'resume-section';
            
            const contTitle = document.createElement('div');
            contTitle.className = 'resume-section-title';
            contTitle.textContent = eduSectionTitle;
            educationSection.appendChild(contTitle);
          }
          
          // Add this education item to the current section
          educationSection.appendChild(eduItem);
          totalEduItems++;
          currentContentHeight += itemHeight;
        });
        
        // Add the final education section if there's anything left
        if (educationSection.children.length > 1) {
          addSectionToPage(educationSection, 0);
        }
      }
      
      // Add certifications section with pagination
      if (certifications.length > 0) {
        let certSectionTitle = 'CERTIFICATIONS';
        let certificationsSection = document.createElement('div');
        certificationsSection.className = 'resume-section';
        
        const certTitle = document.createElement('div');
        certTitle.className = 'resume-section-title';
        certTitle.textContent = certSectionTitle;
        certificationsSection.appendChild(certTitle);
        
        const certsDiv = document.createElement('div');
        certsDiv.className = 'space-y-1';
        
        // Estimate total height
        const certSectionBaseHeight = 10;
        const certItemHeight = 5;
        const totalCertHeight = certSectionBaseHeight + (certifications.length * certItemHeight);
        
        // Check if this section needs a new page
        if (currentContentHeight + totalCertHeight > maxContentHeight) {
          createNewPage();
          currentContentHeight = 0;
        }
        
        certifications.forEach(cert => {
          const certItem = document.createElement('div');
          
          const nameSpan = document.createElement('span');
          nameSpan.className = 'font-bold';
          nameSpan.textContent = cert.name;
          certItem.appendChild(nameSpan);
          
          if (cert.issuer) {
            const issuerSpan = document.createElement('span');
            issuerSpan.textContent = `, ${cert.issuer}`;
            certItem.appendChild(issuerSpan);
          }
          
          certsDiv.appendChild(certItem);
          currentContentHeight += certItemHeight;
        });
        
        certificationsSection.appendChild(certsDiv);
        addSectionToPage(certificationsSection, 0);
      }
      
      // Add skills section with pagination
      if (skills.length > 0) {
        let skillsSectionTitle = 'SKILLS';
        let skillsSection = document.createElement('div');
        skillsSection.className = 'resume-section';
        
        const skillsTitle = document.createElement('div');
        skillsTitle.className = 'resume-section-title';
        skillsTitle.textContent = skillsSectionTitle;
        skillsSection.appendChild(skillsTitle);
        
        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'grid grid-cols-1 gap-2';
        
        // Estimate total height
        const skillsSectionBaseHeight = 10;
        const skillItemHeight = 6;
        const totalSkillsHeight = skillsSectionBaseHeight + (skills.length * skillItemHeight);
        
        // Check if this section needs a new page
        if (currentContentHeight + totalSkillsHeight > maxContentHeight) {
          createNewPage();
          currentContentHeight = 0;
        }
        
        skills.forEach(skillCategory => {
          const skillItem = document.createElement('div');
          skillItem.className = 'grid grid-cols-4 gap-2';
          
          const categoryDiv = document.createElement('div');
          categoryDiv.className = 'font-bold';
          categoryDiv.textContent = skillCategory.category;
          skillItem.appendChild(categoryDiv);
          
          const skillsDiv = document.createElement('div');
          skillsDiv.className = 'col-span-3';
          skillsDiv.textContent = skillCategory.skills;
          skillItem.appendChild(skillsDiv);
          
          skillsGrid.appendChild(skillItem);
          currentContentHeight += skillItemHeight;
        });
        
        skillsSection.appendChild(skillsGrid);
        addSectionToPage(skillsSection, 0);
      }
      
      // Add page numbers
      const allPages = Array.from(container.querySelectorAll('.resume-page'));
      setPages(allPages.length);
      
      allPages.forEach((page, index) => {
        const pageNumber = document.createElement('div');
        pageNumber.className = 'resume-page-number';
        pageNumber.textContent = `Page ${index + 1} of ${allPages.length}`;
        page.appendChild(pageNumber);
      });
    };
    
    // Call the rendering function whenever data changes
    renderResume();
  }, [data, personalInfo, summary, experience, projects, education, certifications, skills]);

  return (
    <div id="resume-preview" ref={containerRef} className="resume-preview-container">
      {/* Content will be rendered dynamically by the useEffect */}
    </div>
  );
};

export default ResumePreview;
