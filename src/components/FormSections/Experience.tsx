
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExperienceItemType } from "@/types/resume";
import { PlusCircle, Trash2, Pencil, XCircle, Save } from "lucide-react";
import { useState } from "react";

interface ExperienceProps {
  data: ExperienceItemType[];
  updateData: (data: ExperienceItemType[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Experience = ({ data, updateData, onNext, onBack }: ExperienceProps) => {
  const [experiences, setExperiences] = useState<ExperienceItemType[]>(data);
  const [editing, setEditing] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<ExperienceItemType>({
    id: "",
    title: "",
    company: "",
    location: "",
    isRemote: false,
    startDate: "",
    endDate: "",
    current: false,
    bulletPoints: [""]
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(experiences);
    onNext();
  };

  const handleAddExperience = () => {
    const id = Date.now().toString();
    const experienceWithId = { ...newExperience, id };
    setExperiences([...experiences, experienceWithId]);
    setNewExperience({
      id: "",
      title: "",
      company: "",
      location: "",
      isRemote: false,
      startDate: "",
      endDate: "",
      current: false,
      bulletPoints: [""]
    });
    setIsAdding(false);
  };

  const handleUpdateExperience = (id: string) => {
    setExperiences(experiences.map(exp => exp.id === id ? 
      { ...experiences.find(e => e.id === id) as ExperienceItemType } : 
      exp
    ));
    setEditing(null);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
    if (editing === id) setEditing(null);
  };

  const handleChangeNewExperience = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeExistingExperience = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [name]: value } : exp
    ));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string | null
  ) => {
    const { name, checked } = e.target;
    
    if (id === null) {
      setNewExperience(prev => {
        // If current is checked, also clear the end date
        if (name === "current" && checked) {
          return { ...prev, [name]: checked, endDate: "" };
        }
        return { ...prev, [name]: checked };
      });
    } else {
      setExperiences(experiences.map(exp => {
        if (exp.id === id) {
          // If current is checked, also clear the end date
          if (name === "current" && checked) {
            return { ...exp, [name]: checked, endDate: "" };
          }
          return { ...exp, [name]: checked };
        }
        return exp;
      }));
    }
  };

  const handleAddBulletPoint = (id: string | null) => {
    if (id === null) {
      setNewExperience(prev => ({
        ...prev,
        bulletPoints: [...prev.bulletPoints, ""]
      }));
    } else {
      setExperiences(experiences.map(exp => {
        if (exp.id === id) {
          return {
            ...exp,
            bulletPoints: [...exp.bulletPoints, ""]
          };
        }
        return exp;
      }));
    }
  };

  const handleChangeBulletPoint = (
    id: string | null,
    index: number,
    value: string
  ) => {
    if (id === null) {
      setNewExperience(prev => {
        const newBulletPoints = [...prev.bulletPoints];
        newBulletPoints[index] = value;
        return { ...prev, bulletPoints: newBulletPoints };
      });
    } else {
      setExperiences(experiences.map(exp => {
        if (exp.id === id) {
          const newBulletPoints = [...exp.bulletPoints];
          newBulletPoints[index] = value;
          return { ...exp, bulletPoints: newBulletPoints };
        }
        return exp;
      }));
    }
  };

  const handleDeleteBulletPoint = (id: string | null, index: number) => {
    if (id === null) {
      setNewExperience(prev => {
        const newBulletPoints = [...prev.bulletPoints];
        newBulletPoints.splice(index, 1);
        return { ...prev, bulletPoints: newBulletPoints.length ? newBulletPoints : [""] };
      });
    } else {
      setExperiences(experiences.map(exp => {
        if (exp.id === id) {
          const newBulletPoints = [...exp.bulletPoints];
          newBulletPoints.splice(index, 1);
          return { 
            ...exp, 
            bulletPoints: newBulletPoints.length ? newBulletPoints : [""] 
          };
        }
        return exp;
      }));
    }
  };

  const renderExperienceForm = (
    experience: ExperienceItemType,
    isNew: boolean = false,
    id: string | null = null
  ) => (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`title${id || "new"}`}>Job Title</Label>
          <Input
            id={`title${id || "new"}`}
            name="title"
            placeholder="e.g., Product Designer"
            value={experience.title}
            onChange={(e) => 
              isNew 
                ? handleChangeNewExperience(e) 
                : handleChangeExistingExperience(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`company${id || "new"}`}>Company</Label>
          <Input
            id={`company${id || "new"}`}
            name="company"
            placeholder="e.g., RAACOM Infosystems"
            value={experience.company}
            onChange={(e) => 
              isNew 
                ? handleChangeNewExperience(e) 
                : handleChangeExistingExperience(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`location${id || "new"}`}>Location</Label>
          <Input
            id={`location${id || "new"}`}
            name="location"
            placeholder="e.g., Boston, MA"
            value={experience.location}
            onChange={(e) => 
              isNew 
                ? handleChangeNewExperience(e) 
                : handleChangeExistingExperience(id as string, e)
            }
            required
          />
        </div>

        <div className="flex items-center h-full pt-8">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`isRemote${id || "new"}`}
              name="isRemote"
              checked={experience.isRemote}
              onCheckedChange={(checked) => {
                const e = { 
                  target: { 
                    name: "isRemote", 
                    checked: checked === true 
                  } 
                } as React.ChangeEvent<HTMLInputElement>;
                handleCheckboxChange(e, id);
              }}
            />
            <Label 
              htmlFor={`isRemote${id || "new"}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remote Position
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`startDate${id || "new"}`}>Start Date</Label>
          <Input
            id={`startDate${id || "new"}`}
            name="startDate"
            type="month"
            value={experience.startDate}
            onChange={(e) => 
              isNew 
                ? handleChangeNewExperience(e) 
                : handleChangeExistingExperience(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor={`endDate${id || "new"}`}>End Date</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`current${id || "new"}`}
                name="current"
                checked={experience.current}
                onCheckedChange={(checked) => {
                  const e = { 
                    target: { 
                      name: "current", 
                      checked: checked === true 
                    } 
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleCheckboxChange(e, id);
                }}
              />
              <Label 
                htmlFor={`current${id || "new"}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Current Job
              </Label>
            </div>
          </div>
          <Input
            id={`endDate${id || "new"}`}
            name="endDate"
            type="month"
            value={experience.endDate}
            onChange={(e) => 
              isNew 
                ? handleChangeNewExperience(e) 
                : handleChangeExistingExperience(id as string, e)
            }
            disabled={experience.current}
            required={!experience.current}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Bullet Points (Responsibilities & Achievements)</Label>
        {experience.bulletPoints.map((point, index) => (
          <div key={`${id || "new"}-bullet-${index}`} className="flex gap-2">
            <Textarea
              placeholder="e.g., Redesigned key modules for Identable, a live AI SaaS product, significantly enhancing user experience and functionality."
              value={point}
              onChange={(e) => handleChangeBulletPoint(id, index, e.target.value)}
              className="flex-1"
              required={index === 0}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleDeleteBulletPoint(id, index)}
              disabled={experience.bulletPoints.length === 1 && index === 0}
              className="h-auto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => handleAddBulletPoint(id)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Bullet Point
        </Button>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {isNew ? (
          <>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddExperience}>
              Add Experience
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleUpdateExperience(id as string)}>
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
        <h2 className="text-2xl font-serif font-semibold">Work Experience</h2>
        <p className="text-muted-foreground">
          Add your relevant work experiences, starting with the most recent.
        </p>
      </div>

      {experiences.length > 0 && (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id}>
              <CardContent className="p-4">
                {editing === exp.id ? (
                  renderExperienceForm(exp, false, exp.id)
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.location}{exp.isRemote ? ' (Remote)' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                        {exp.current 
                          ? ' Present' 
                          : ` ${new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
                        }
                      </p>
                      <ul className="list-disc list-inside mt-2 text-sm">
                        {exp.bulletPoints.filter(Boolean).map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(exp.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExperience(exp.id)}
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
        renderExperienceForm(newExperience, true)
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Experience
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

export default Experience;
