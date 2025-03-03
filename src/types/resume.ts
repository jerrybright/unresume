
export type PersonalInfoType = {
  name: string;
  phone: string;
  location: string;
  email: string;
  portfolio?: string;
  linkedin?: string;
};

export type ExperienceItemType = {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
};

export type ProjectItemType = {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
};

export type EducationItemType = {
  id: string;
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
};

export type CertificationType = {
  id: string;
  name: string;
  issuer: string;
};

export type SkillCategoryType = {
  id: string;
  category: string;
  skills: string;
};

export type ResumeDataType = {
  personalInfo: PersonalInfoType;
  summary: string;
  experience: ExperienceItemType[];
  projects: ProjectItemType[];
  education: EducationItemType[];
  certifications: CertificationType[];
  skills: SkillCategoryType[];
};

export const defaultResumeData: ResumeDataType = {
  personalInfo: {
    name: "",
    phone: "",
    location: "",
    email: "",
    portfolio: "",
    linkedin: ""
  },
  summary: "",
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  skills: []
};
