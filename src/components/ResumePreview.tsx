
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
      
      // Add header/contact info
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
        
        currentContentDiv.appendChild(headerSection);
      }
      
      // Function to check if adding a section would overflow and create a new page if needed
      const checkOverflowAndAddSection = (sectionElement: HTMLElement) => {
        // Temporarily add the section to check if it causes overflow
        currentContentDiv.appendChild(sectionElement);
        
        // Check if it overflows the page
        const pageHeight = 1056; // approximately 11 inches at 96dpi
        if (currentPage.scrollHeight > pageHeight) {
          // Remove section from current page
          currentContentDiv.removeChild(sectionElement);
          
          // Create a new page
          const newPage = document.createElement('div');
          newPage.className = 'resume-page';
          container.appendChild(newPage);
          
          // Update current page reference
          currentPage = newPage;
          currentContentDiv = document.createElement('div');
          currentContentDiv.className = 'resume-content';
          currentPage.appendChild(currentContentDiv);
          
          // Add section to the new page
          currentContentDiv.appendChild(sectionElement);
        }
      };
      
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
        
        checkOverflowAndAddSection(summarySection);
      }
      
      // Add experience section
      if (experience.length > 0) {
        let experienceSection = document.createElement('div');
        experienceSection.className = 'resume-section';
        
        const expTitle = document.createElement('div');
        expTitle.className = 'resume-section-title';
        expTitle.textContent = 'EXPERIENCE';
        experienceSection.appendChild(expTitle);
        
        experience.forEach(exp => {
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
          
          // Add the experience item to the section
          experienceSection.appendChild(expItem);
          
          // Check if the whole section is too large and would overflow
          if (experienceSection.offsetHeight > 800) {
            // Remove the item we just added
            experienceSection.removeChild(expItem);
            
            // Add the current experience section to the page
            checkOverflowAndAddSection(experienceSection);
            
            // Create a new experience section for the next items
            experienceSection = document.createElement('div');
            experienceSection.className = 'resume-section';
            
            // Only add the title if it's the first item in a new page
            if (currentContentDiv.children.length === 0) {
              const newExpTitle = document.createElement('div');
              newExpTitle.className = 'resume-section-title';
              newExpTitle.textContent = 'EXPERIENCE (Continued)';
              experienceSection.appendChild(newExpTitle);
            }
            
            // Add the item to the new section
            experienceSection.appendChild(expItem);
          }
        });
        
        // Add any remaining experience items
        if (experienceSection.children.length > 0) {
          checkOverflowAndAddSection(experienceSection);
        }
      }
      
      // Add projects section with similar logic to experience
      if (projects.length > 0) {
        let projectsSection = document.createElement('div');
        projectsSection.className = 'resume-section';
        
        const projTitle = document.createElement('div');
        projTitle.className = 'resume-section-title';
        projTitle.textContent = 'PROJECTS';
        projectsSection.appendChild(projTitle);
        
        projects.forEach(project => {
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
          
          projectsSection.appendChild(projItem);
          
          // Check if the whole section is too large and would overflow
          if (projectsSection.offsetHeight > 800) {
            // Remove the item we just added
            projectsSection.removeChild(projItem);
            
            // Add the current projects section to the page
            checkOverflowAndAddSection(projectsSection);
            
            // Create a new projects section for the next items
            projectsSection = document.createElement('div');
            projectsSection.className = 'resume-section';
            
            // Only add the title if it's the first item in a new page
            if (currentContentDiv.children.length === 0) {
              const newProjTitle = document.createElement('div');
              newProjTitle.className = 'resume-section-title';
              newProjTitle.textContent = 'PROJECTS (Continued)';
              projectsSection.appendChild(newProjTitle);
            }
            
            // Add the item to the new section
            projectsSection.appendChild(projItem);
          }
        });
        
        // Add any remaining project items
        if (projectsSection.children.length > 0) {
          checkOverflowAndAddSection(projectsSection);
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
        
        checkOverflowAndAddSection(eduSection);
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
        checkOverflowAndAddSection(certSection);
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
        checkOverflowAndAddSection(skillsSection);
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
