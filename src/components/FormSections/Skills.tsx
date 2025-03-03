
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillCategoryType } from "@/types/resume";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

interface SkillsProps {
  data: SkillCategoryType[];
  updateData: (data: SkillCategoryType[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Skills = ({ data, updateData, onNext, onBack }: SkillsProps) => {
  const [skills, setSkills] = useState<SkillCategoryType[]>(data);
  const [editing, setEditing] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<SkillCategoryType>({
    id: "",
    category: "",
    skills: ""
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(skills);
    onNext();
  };

  const handleAddSkill = () => {
    const id = Date.now().toString();
    const skillWithId = { ...newSkill, id };
    setSkills([...skills, skillWithId]);
    setNewSkill({
      id: "",
      category: "",
      skills: ""
    });
    setIsAdding(false);
  };

  const handleUpdateSkill = (id: string) => {
    setSkills(skills.map(skill => skill.id === id ? 
      { ...skills.find(s => s.id === id) as SkillCategoryType } : 
      skill
    ));
    setEditing(null);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
    if (editing === id) setEditing(null);
  };

  const handleChangeNewSkill = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeExistingSkill = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [name]: value } : skill
    ));
  };

  const renderSkillForm = (
    skill: SkillCategoryType,
    isNew: boolean = false,
    id: string | null = null
  ) => (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`category${id || "new"}`}>Skill Category</Label>
          <Input
            id={`category${id || "new"}`}
            name="category"
            placeholder="e.g., Technical Skills"
            value={skill.category}
            onChange={(e) => 
              isNew 
                ? handleChangeNewSkill(e) 
                : handleChangeExistingSkill(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`skills${id || "new"}`}>Skills List</Label>
          <Textarea
            id={`skills${id || "new"}`}
            name="skills"
            placeholder="e.g., User Research, UX Writing, Design System, Journey Mapping, User Flows, Task Flows"
            value={skill.skills}
            onChange={(e) => 
              isNew 
                ? handleChangeNewSkill(e) 
                : handleChangeExistingSkill(id as string, e)
            }
            className="min-h-[100px]"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate skills with commas, semicolons, or line breaks.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {isNew ? (
          <>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddSkill}>
              Add Skill Category
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleUpdateSkill(id as string)}>
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
        <h2 className="text-2xl font-serif font-semibold">Skills</h2>
        <p className="text-muted-foreground">
          Add your key skills, organized by category.
        </p>
      </div>

      {skills.length > 0 && (
        <div className="space-y-4">
          {skills.map((skill) => (
            <Card key={skill.id}>
              <CardContent className="p-4">
                {editing === skill.id ? (
                  renderSkillForm(skill, false, skill.id)
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{skill.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {skill.skills}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(skill.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSkill(skill.id)}
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
        renderSkillForm(newSkill, true)
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Skill Category
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

export default Skills;
