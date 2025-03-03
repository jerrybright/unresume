
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EducationItemType } from "@/types/resume";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

interface EducationProps {
  data: EducationItemType[];
  updateData: (data: EducationItemType[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Education = ({ data, updateData, onNext, onBack }: EducationProps) => {
  const [education, setEducation] = useState<EducationItemType[]>(data);
  const [editing, setEditing] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<EducationItemType>({
    id: "",
    degree: "",
    institution: "",
    startYear: "",
    endYear: ""
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(education);
    onNext();
  };

  const handleAddEducation = () => {
    const id = Date.now().toString();
    const educationWithId = { ...newEducation, id };
    setEducation([...education, educationWithId]);
    setNewEducation({
      id: "",
      degree: "",
      institution: "",
      startYear: "",
      endYear: ""
    });
    setIsAdding(false);
  };

  const handleUpdateEducation = (id: string) => {
    setEducation(education.map(edu => edu.id === id ? 
      { ...education.find(e => e.id === id) as EducationItemType } : 
      edu
    ));
    setEditing(null);
  };

  const handleDeleteEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
    if (editing === id) setEditing(null);
  };

  const handleChangeNewEducation = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeExistingEducation = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [name]: value } : edu
    ));
  };

  const renderEducationForm = (
    edu: EducationItemType,
    isNew: boolean = false,
    id: string | null = null
  ) => (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`degree${id || "new"}`}>Degree / Certificate</Label>
          <Input
            id={`degree${id || "new"}`}
            name="degree"
            placeholder="e.g., Bachelor of Information Technology"
            value={edu.degree}
            onChange={(e) => 
              isNew 
                ? handleChangeNewEducation(e) 
                : handleChangeExistingEducation(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`institution${id || "new"}`}>Institution</Label>
          <Input
            id={`institution${id || "new"}`}
            name="institution"
            placeholder="e.g., St. Joseph's Institute of Technology"
            value={edu.institution}
            onChange={(e) => 
              isNew 
                ? handleChangeNewEducation(e) 
                : handleChangeExistingEducation(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`startYear${id || "new"}`}>Start Year</Label>
          <Input
            id={`startYear${id || "new"}`}
            name="startYear"
            type="number"
            min="1900"
            max="2099"
            placeholder="e.g., 2020"
            value={edu.startYear}
            onChange={(e) => 
              isNew 
                ? handleChangeNewEducation(e) 
                : handleChangeExistingEducation(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`endYear${id || "new"}`}>End Year (or Expected)</Label>
          <Input
            id={`endYear${id || "new"}`}
            name="endYear"
            type="number"
            min="1900"
            max="2099"
            placeholder="e.g., 2024"
            value={edu.endYear}
            onChange={(e) => 
              isNew 
                ? handleChangeNewEducation(e) 
                : handleChangeExistingEducation(id as string, e)
            }
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {isNew ? (
          <>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddEducation}>
              Add Education
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleUpdateEducation(id as string)}>
              Save Changes
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-semibold">Education</h2>
        <p className="text-muted-foreground">
          Add your educational background, starting with the most recent.
        </p>
      </div>

      {education.length > 0 && (
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id}>
              <CardContent className="p-4">
                {editing === edu.id ? (
                  renderEducationForm(edu, false, edu.id)
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {edu.startYear} - {edu.endYear}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(edu.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isAdding ? (
        renderEducationForm(newEducation, true)
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" size="lg">
            Next Step
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Education;
