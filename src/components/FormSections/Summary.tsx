
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface SummaryProps {
  data: string;
  updateData: (data: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const Summary = ({ data, updateData, onNext, onBack }: SummaryProps) => {
  const [summary, setSummary] = useState<string>(data);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(summary);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-semibold">Professional Summary</h2>
        <p className="text-muted-foreground">
          Write a concise summary highlighting your professional background, expertise, and career goals.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          placeholder="I'm a UI/UX designer dedicated to crafting intuitive, user-centric mobile and web apps. I focus on creating visually appealing, functional designs that enhance digital experiences and solve user problems."
          value={summary}
          onChange={handleChange}
          className="min-h-[200px]"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Keep your summary concise and focused on your most relevant qualifications (2-4 sentences).
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default Summary;
