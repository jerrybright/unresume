
import { ResumeDataType } from "@/types/resume";
import { formatDate } from "@/utils/formatters";

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

  return (
    <div id="resume-preview" className="resume-paper">
      <div className="resume-content">
        {/* Header/Contact Info */}
        {personalInfo.name && (
          <div className="resume-name">
            {personalInfo.name.toUpperCase()}
          </div>
        )}
        
        {personalInfo && (
          <div className="resume-contact">
            {personalInfo.phone && (
              <span>{personalInfo.phone}</span>
            )}
            {personalInfo.phone && personalInfo.location && (
              <span> • </span>
            )}
            {personalInfo.location && (
              <span>{personalInfo.location}</span>
            )}
            {(personalInfo.phone || personalInfo.location) && 
              (personalInfo.portfolio || personalInfo.linkedin || personalInfo.email) && (
              <br />
            )}
            {personalInfo.portfolio && (
              <span>Portfolio: {personalInfo.portfolio}</span>
            )}
            {personalInfo.portfolio && personalInfo.linkedin && (
              <span> • </span>
            )}
            {personalInfo.linkedin && (
              <span>LinkedIn/{personalInfo.linkedin}</span>
            )}
            {(personalInfo.portfolio || personalInfo.linkedin) && personalInfo.email && (
              <span> • </span>
            )}
            {personalInfo.email && (
              <span>{personalInfo.email}</span>
            )}
          </div>
        )}

        {/* Summary Section */}
        {summary && (
          <div className="resume-section">
            <div className="resume-section-title">SUMMARY</div>
            <div>{summary}</div>
          </div>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">EXPERIENCE</div>
            {experience.map((exp) => (
              <div key={exp.id} className="resume-item">
                <div className="flex justify-between">
                  <div className="font-bold">{exp.title} {exp.company && `(${exp.company})`}</div>
                  <div className="text-right">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                <div className="text-sm italic mb-1">
                  {exp.location}{exp.isRemote ? ', Remote' : ''}
                </div>
                <ul className="list-disc pl-5 text-sm">
                  {exp.bulletPoints.filter(Boolean).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">PROJECTS</div>
            {projects.map((project) => (
              <div key={project.id} className="resume-item">
                <div className="font-bold">{project.title}</div>
                {project.description && (
                  <div className="text-sm italic mb-1">{project.description}</div>
                )}
                <ul className="list-disc pl-5 text-sm">
                  {project.bulletPoints.filter(Boolean).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">EDUCATION</div>
            {education.map((edu) => (
              <div key={edu.id} className="resume-item">
                <div className="flex justify-between">
                  <div className="font-bold">{edu.degree}</div>
                  <div className="text-right">
                    {edu.startYear} - {edu.endYear}
                  </div>
                </div>
                <div className="text-sm">{edu.institution}</div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">CERTIFICATIONS</div>
            <div className="space-y-1">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <span className="font-bold">{cert.name}</span>
                  {cert.issuer && <span>, {cert.issuer}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">SKILLS</div>
            <div className="grid grid-cols-1 gap-2">
              {skills.map((skillCategory) => (
                <div key={skillCategory.id} className="grid grid-cols-4 gap-2">
                  <div className="font-bold">{skillCategory.category}</div>
                  <div className="col-span-3">{skillCategory.skills}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
