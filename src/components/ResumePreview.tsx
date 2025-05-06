
import { ResumeDataType } from "@/types/resume";
import { formatDate, formatSafeText } from "@/utils/formatters";
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
      const maxContentHeight = 267; // in mm (297mm - 2*15mm margins)
      let currentContentHeight = 0;
      
      // Function to create a new page when needed
      const createNewPageIfNeeded = (elementHeight: number = 0) => {
        // If adding this element would exceed the page height or if there's no content yet
        if (currentContentHeight + elementHeight > maxContentHeight || currentContentDiv.children.length === 0) {
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
          return true;
        }
        return false;
      };
      
      // Function to add section to the current page with overflow handling
      const addSectionWithOverflowHandling = (sectionElement: HTMLElement, isNewSection: boolean = true) => {
        // Estimate height based on content (approximate)
        const estimatedHeight = sectionElement.scrollHeight / 3.78; // Convert px to mm
        
        // If we're adding a new section and it exceeds available space, create a new page
        if (isNewSection && currentContentHeight > 0 && (currentContentHeight + estimatedHeight > maxContentHeight)) {
          createNewPageIfNeeded(estimatedHeight);
        }
        
        // Add the section to the current content
        currentContentDiv.appendChild(sectionElement);
        
        // Update the current content height
        currentContentHeight += estimatedHeight;
      };
      
      // Add header/contact info (always at the top of the first page)
      if (personalInfo.name) {
        const headerSection = document.createElement('div');
        headerSection.className = 'resume-section header-section';
        
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
        
        addSectionWithOverflowHandling(headerSection);
        currentContentHeight += 15; // Add spacing after header
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
        
        addSectionWithOverflowHandling(summarySection);
      }
      
      // Add experience section
      if (experience.length > 0) {
        let experienceSection = document.createElement('div');
        experienceSection.className = 'resume-section';
        
        const expTitle = document.createElement('div');
        expTitle.className = 'resume-section-title';
        expTitle.textContent = 'EXPERIENCE';
        experienceSection.appendChild(expTitle);
        
        // Add each experience item to the section
        experience.forEach((exp, index) => {
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
          
          // Calculate approximate height of this experience item
          const itemEstimatedHeight = 10 + (exp.bulletPoints?.length || 0) * 4; // Base height + bullets
          
          // If this item would likely cause a page break, start it on a new page
          if (currentContentHeight + itemEstimatedHeight > maxContentHeight) {
            // Add any existing content to the current page
            if (experienceSection.children.length > 1) { // > 1 because it already has the title
              addSectionWithOverflowHandling(experienceSection);
              
              // Create a new experience section for the next item
              experienceSection = document.createElement('div');
              experienceSection.className = 'resume-section';
              
              // Only add title for continued section
              if (index > 0) {
                const newExpTitle = document.createElement('div');
                newExpTitle.className = 'resume-section-title';
                newExpTitle.textContent = 'EXPERIENCE (Continued)';
                experienceSection.appendChild(newExpTitle);
              } else {
                // Copy the original title
                experienceSection.appendChild(expTitle.cloneNode(true));
              }
            }
          }
          
          // Add this experience item to the current section
          experienceSection.appendChild(expItem);
          
          // If this was the last item or it's a large section, add it to the page
          if (index === experience.length - 1) {
            addSectionWithOverflowHandling(experienceSection);
          }
        });
      }
      
      // Add projects section with similar logic to experience
      if (projects.length > 0) {
        let projectsSection = document.createElement('div');
        projectsSection.className = 'resume-section';
        
        const projTitle = document.createElement('div');
        projTitle.className = 'resume-section-title';
        projTitle.textContent = 'PROJECTS';
        projectsSection.appendChild(projTitle);
        
        // Add each project to the section
        projects.forEach((project, index) => {
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
          
          // Calculate approximate height of this project item
          const itemEstimatedHeight = 10 + (project.bulletPoints?.length || 0) * 4; // Base height + bullets
          
          // If this item would likely cause a page break, start it on a new page
          if (currentContentHeight + itemEstimatedHeight > maxContentHeight) {
            // Add any existing content to the current page
            if (projectsSection.children.length > 1) { // > 1 because it already has the title
              addSectionWithOverflowHandling(projectsSection);
              
              // Create a new projects section for the next item
              projectsSection = document.createElement('div');
              projectsSection.className = 'resume-section';
              
              // Only add title for continued section
              if (index > 0) {
                const newProjTitle = document.createElement('div');
                newProjTitle.className = 'resume-section-title';
                newProjTitle.textContent = 'PROJECTS (Continued)';
                projectsSection.appendChild(newProjTitle);
              } else {
                // Copy the original title
                projectsSection.appendChild(projTitle.cloneNode(true));
              }
            }
          }
          
          // Add this project item to the current section
          projectsSection.appendChild(projItem);
          
          // If this was the last item, add it to the page
          if (index === projects.length - 1) {
            addSectionWithOverflowHandling(projectsSection);
          }
        });
      }
      
      // Add education section
      if (education.length > 0) {
        const eduSection = document.createElement('div');
        eduSection.className = 'resume-section';
        
        const eduTitle = document.createElement('div');
        eduTitle.className = 'resume-section-title';
        eduTitle.textContent = 'EDUCATION';
        eduSection.appendChild(eduTitle);
        
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
          
          eduSection.appendChild(eduItem);
        });
        
        // If this section would push us over the page limit, create a new page
        addSectionWithOverflowHandling(eduSection);
      }
      
      // Add certifications section
      if (certifications.length > 0) {
        const certSection = document.createElement('div');
        certSection.className = 'resume-section';
        
        const certTitle = document.createElement('div');
        certTitle.className = 'resume-section-title';
        certTitle.textContent = 'CERTIFICATIONS';
        certSection.appendChild(certTitle);
        
        const certsDiv = document.createElement('div');
        certsDiv.className = 'space-y-1';
        
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
        });
        
        certSection.appendChild(certsDiv);
        
        // If this section would push us over the page limit, create a new page
        addSectionWithOverflowHandling(certSection);
      }
      
      // Add skills section
      if (skills.length > 0) {
        const skillsSection = document.createElement('div');
        skillsSection.className = 'resume-section';
        
        const skillsTitle = document.createElement('div');
        skillsTitle.className = 'resume-section-title';
        skillsTitle.textContent = 'SKILLS';
        skillsSection.appendChild(skillsTitle);
        
        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'grid grid-cols-1 gap-2';
        
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
        });
        
        skillsSection.appendChild(skillsGrid);
        
        // If this section would push us over the page limit, create a new page
        addSectionWithOverflowHandling(skillsSection);
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
