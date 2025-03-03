
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import { defaultResumeData, ResumeDataType } from "@/types/resume";
import { PenLine, Eye, Share2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeDataType>(defaultResumeData);
  const [activeTab, setActiveTab] = useState<string>("edit");

  const handleUpdateResumeData = (data: ResumeDataType) => {
    setResumeData(data);
  };

  const handleRestart = () => {
    if (confirm("Are you sure you want to start over? This will clear all your current resume data.")) {
      setResumeData(defaultResumeData);
      setActiveTab("edit");
      toast.info("Started a new resume");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out my resume",
          text: "I created my resume with the resume builder!",
          url: window.location.href
        });
      } else {
        // Fallback if Web Share API is not available
        toast.error("Sharing is not supported on this browser");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-serif font-semibold text-primary">
              Resume Builder
            </h1>
          </div>
          <div className="space-x-2 no-print">
            <Button variant="outline" size="sm" onClick={handleShare} className="hidden md:inline-flex">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestart}>
              Start Over
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4 no-print">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="edit" className="flex-1 flex items-center">
                  <PenLine className="h-4 w-4 mr-2" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-0">
                <ResumeForm
                  data={resumeData}
                  updateData={handleUpdateResumeData}
                  onRestart={handleRestart}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                <div className="lg:hidden">
                  <ResumePreview data={resumeData} />
                </div>
                <div className="hidden lg:block text-center py-8 space-y-4">
                  <p className="text-muted-foreground">
                    Preview is shown on the right side of the screen.
                  </p>
                  <Button onClick={() => setActiveTab("edit")}>
                    Return to Editing
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-7 xl:col-span-8 flex justify-center overflow-auto sticky top-8">
            <div className="resume-container transition-all duration-300 ease-in-out transform scale-[0.65] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 origin-top">
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 bg-white no-print">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Resume Builder. Create beautiful resumes instantly.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
