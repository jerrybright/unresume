
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
      
      // Maximum content height per page (A4 height minus margins)
      const maxContentHeight = 270; // in mm (297mm - 27mm for margins and headers)
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
        if (isSectionStart && currentContentHeight > 0 && 
            checkOverflowAndCreatePage(Math.min(estimatedHeight, 30))) {
          // Created a new page for this section
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
        
        addSectionToPage(headerSection, 15); // Add header with estimated height
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
        
        const summaryHeight = 10 + Math.ceil(summary.length / 100) * 4; // Rough estimate of height
        addSectionToPage(summarySection, summaryHeight);
      }
      
      // Add experience section
      if (experience.length > 0) {
        let experienceSection = document.createElement('div');
        experienceSection.className = 'resume-section';
        
        const expTitle = document.createElement('div');
        expTitle.className = 'resume-section-title';
        expTitle.textContent = 'EXPERIENCE';
        experienceSection.appendChild(expTitle);
        
        // Track if this is a continued section
        let isFirstExperience = true;
        
        // Add each experience item to the section
        experience.forEach((exp) => {
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
          
          // Calculate approximate height of this experience item
          const itemHeight = 10 + (exp.bulletPoints?.length || 0) * 5; // Base height + bullets
          
          // Check if adding this item would cause overflow
          if (currentContentHeight + itemHeight > maxContentHeight) {
            // Add the current experience section to the page
            if (experienceSection.children.length > 1) {
              addSectionToPage(experienceSection, currentContentHeight, false);
              
              // Create a new section for the next items
              experienceSection = document.createElement('div');
              experienceSection.className = 'resume-section';
              
              if (!isFirstExperience) {
                // This is a continuation of the experience section
                const newTitle = document.createElement('div');
                newTitle.className = 'resume-section-title';
                newTitle.textContent = 'EXPERIENCE (Continued)';
                experienceSection.appendChild(newTitle);
              } else {
                // This is the first experience item but it needs a new page
                experienceSection.appendChild(expTitle.cloneNode(true));
              }
            }
            
            // Create a new page for this item
            createNewPage();
            currentContentHeight = 0;
          }
          
          // Add this experience item to the current section
          experienceSection.appendChild(expItem);
          isFirstExperience = false;
          
          // Update height
          currentContentHeight += itemHeight;
        });
        
        // Add the final experience section if there's anything left
        if (experienceSection.children.length > 1) {
          addSectionToPage(experienceSection, 0, false);
        }
      }
      
      // Add projects section with similar pagination logic
      if (projects.length > 0) {
        let projectsSection = document.createElement('div');
        projectsSection.className = 'resume-section';
        
        const projTitle = document.createElement('div');
        projTitle.className = 'resume-section-title';
        projTitle.textContent = 'PROJECTS';
        projectsSection.appendChild(projTitle);
        
        // Track if this is a continued section
        let isFirstProject = true;
        
        // Add each project to the section
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
          
          // Calculate approximate height of this project item
          const itemHeight = 10 + (project.bulletPoints?.length || 0) * 5; // Base height + bullets
          
          // Check if adding this item would cause overflow
          if (currentContentHeight + itemHeight > maxContentHeight) {
            // Add the current projects section to the page
            if (projectsSection.children.length > 1) {
              addSectionToPage(projectsSection, currentContentHeight, false);
              
              // Create a new section for the next items
              projectsSection = document.createElement('div');
              projectsSection.className = 'resume-section';
              
              if (!isFirstProject) {
                // This is a continuation of the projects section
                const newTitle = document.createElement('div');
                newTitle.className = 'resume-section-title';
                newTitle.textContent = 'PROJECTS (Continued)';
                projectsSection.appendChild(newTitle);
              } else {
                // This is the first project item but it needs a new page
                projectsSection.appendChild(projTitle.cloneNode(true));
              }
            }
            
            // Create a new page for this item
            createNewPage();
            currentContentHeight = 0;
          }
          
          // Add this project item to the current section
          projectsSection.appendChild(projItem);
          isFirstProject = false;
          
          // Update height
          currentContentHeight += itemHeight;
        });
        
        // Add the final projects section if there's anything left
        if (projectsSection.children.length > 1) {
          addSectionToPage(projectsSection, 0, false);
        }
      }
      
      // Add education section
      if (education.length > 0) {
        const eduSection = document.createElement('div');
        eduSection.className = 'resume-section';
        
        const eduTitle = document.createElement('div');
        eduTitle.className = 'resume-section-title';
        eduTitle.textContent = 'EDUCATION';
        eduSection.appendChild(eduTitle);
        
        // Calculate total education section height
        const eduSectionHeight = 10 + education.length * 10;
        
        // Check if this section needs a new page
        checkOverflowAndCreatePage(eduSectionHeight);
        
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
        
        addSectionToPage(eduSection, eduSectionHeight);
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
        
        // Calculate total certifications section height
        const certSectionHeight = 10 + certifications.length * 5;
        
        // Check if this section needs a new page
        checkOverflowAndCreatePage(certSectionHeight);
        
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
        addSectionToPage(certSection, certSectionHeight);
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
        
        // Calculate total skills section height
        const skillsSectionHeight = 10 + skills.length * 5;
        
        // Check if this section needs a new page
        checkOverflowAndCreatePage(skillsSectionHeight);
        
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
        addSectionToPage(skillsSection, skillsSectionHeight);
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
