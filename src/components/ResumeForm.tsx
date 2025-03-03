
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResumeDataType, defaultResumeData } from "@/types/resume";
import PersonalInfo from "./FormSections/PersonalInfo";
import Summary from "./FormSections/Summary";
import Experience from "./FormSections/Experience";
import Projects from "./FormSections/Projects";
import Education from "./FormSections/Education";
import Certifications from "./FormSections/Certifications";
import Skills from "./FormSections/Skills";
import { generatePDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft, Download, Printer, Share2 } from "lucide-react";

interface ResumeFormProps {
  data: ResumeDataType;
  updateData: (data: ResumeDataType) => void;
  onRestart: () => void;
}

const ResumeForm = ({ data, updateData, onRestart }: ResumeFormProps) => {
  type FormStep = 
    | "personal-info"
    | "summary"
    | "experience"
    | "projects"
    | "education"
    | "certifications"
    | "skills"
    | "review";

  const [currentStep, setCurrentStep] = useState<FormStep>("personal-info");
  const [progress, setProgress] = useState<number>(0);

  const handlePersonalInfoUpdate = (personalInfo: typeof data.personalInfo) => {
    updateData({ ...data, personalInfo });
  };

  const handleSummaryUpdate = (summary: string) => {
    updateData({ ...data, summary });
  };

  const handleExperienceUpdate = (experience: typeof data.experience) => {
    updateData({ ...data, experience });
  };

  const handleProjectsUpdate = (projects: typeof data.projects) => {
    updateData({ ...data, projects });
  };

  const handleEducationUpdate = (education: typeof data.education) => {
    updateData({ ...data, education });
  };

  const handleCertificationsUpdate = (certifications: typeof data.certifications) => {
    updateData({ ...data, certifications });
  };

  const handleSkillsUpdate = (skills: typeof data.skills) => {
    updateData({ ...data, skills });
  };

  const goToStep = (step: FormStep) => {
    setCurrentStep(step);
    
    const stepOrder = [
      "personal-info",
      "summary",
      "experience",
      "projects",
      "education",
      "certifications",
      "skills",
      "review",
    ];
    
    const stepIndex = stepOrder.indexOf(step);
    const newProgress = Math.round((stepIndex / (stepOrder.length - 1)) * 100);
    setProgress(newProgress);
  };

  const goToNext = () => {
    switch (currentStep) {
      case "personal-info":
        goToStep("summary");
        break;
      case "summary":
        goToStep("experience");
        break;
      case "experience":
        goToStep("projects");
        break;
      case "projects":
        goToStep("education");
        break;
      case "education":
        goToStep("certifications");
        break;
      case "certifications":
        goToStep("skills");
        break;
      case "skills":
        goToStep("review");
        toast.success("Resume creation complete! You can now download your resume.");
        break;
    }
  };

  const goToPrevious = () => {
    switch (currentStep) {
      case "summary":
        goToStep("personal-info");
        break;
      case "experience":
        goToStep("summary");
        break;
      case "projects":
        goToStep("experience");
        break;
      case "education":
        goToStep("projects");
        break;
      case "certifications":
        goToStep("education");
        break;
      case "skills":
        goToStep("certifications");
        break;
      case "review":
        goToStep("skills");
        break;
    }
  };

  const handleDownloadPDF = async () => {
    toast.promise(
      generatePDF(data),
      {
        loading: "Generating PDF...",
        success: "Resume downloaded successfully!",
        error: "Failed to generate PDF. Please try again."
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "personal-info":
        return (
          <PersonalInfo
            data={data.personalInfo}
            updateData={handlePersonalInfoUpdate}
            onNext={goToNext}
          />
        );
      case "summary":
        return (
          <Summary
            data={data.summary}
            updateData={handleSummaryUpdate}
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );
      case "experience":
        return (
          <Experience
            data={data.experience}
            updateData={handleExperienceUpdate}
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );
      case "projects":
        return (
          <Projects
            data={data.projects}
            updateData={handleProjectsUpdate}
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );
      case "education":
        return (
          <Education
            data={data.education}
            updateData={handleEducationUpdate}
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );
      case "certifications":
        return (
          <Certifications
            data={data.certifications}
            updateData={handleCertificationsUpdate}
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );
      case "skills":
        return (
          <Skills
            data={data.skills}
            updateData={handleSkillsUpdate}
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );
      case "review":
        return (
          <div className="animate-fade-in space-y-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-serif font-semibold">Resume Complete!</h2>
              </div>
              <p className="text-muted-foreground">
                Your resume is ready to download. You can also go back and make changes if needed.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownloadPDF} className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint} className="flex items-center">
                <Printer className="mr-2 h-4 w-4" />
                Print Resume
              </Button>
              <Button variant="outline" onClick={goToPrevious} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Edit Resume
              </Button>
              <Button variant="outline" onClick={onRestart} className="flex items-center">
                Create New Resume
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      {currentStep !== "review" && (
        <div className="mb-6 w-full">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Getting Started</span>
            <span>Complete</span>
          </div>
        </div>
      )}

      {renderCurrentStep()}
    </div>
  );
};

export default ResumeForm;
