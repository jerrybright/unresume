
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalInfoType } from "@/types/resume";
import { useState } from "react";

interface PersonalInfoProps {
  data: PersonalInfoType;
  updateData: (data: PersonalInfoType) => void;
  onNext: () => void;
}

const PersonalInfo = ({ data, updateData, onNext }: PersonalInfoProps) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(personalInfo);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-semibold">Personal Information</h2>
        <p className="text-muted-foreground">
          Let's start with the basics. This information will appear at the top of your resume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., John Smith"
            value={personalInfo.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="e.g., john@example.com"
            value={personalInfo.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="e.g., +1 555-123-4567"
            value={personalInfo.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., New York, NY"
            value={personalInfo.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
          <Input
            id="linkedin"
            name="linkedin"
            placeholder="e.g., linkedin.com/in/johnsmith"
            value={personalInfo.linkedin || ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
          <Input
            id="portfolio"
            name="portfolio"
            placeholder="e.g., johnsmith.com"
            value={personalInfo.portfolio || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg">
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfo;
