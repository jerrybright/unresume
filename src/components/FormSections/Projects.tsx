
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectItemType } from "@/types/resume";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

interface ProjectsProps {
  data: ProjectItemType[];
  updateData: (data: ProjectItemType[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Projects = ({ data, updateData, onNext, onBack }: ProjectsProps) => {
  const [projects, setProjects] = useState<ProjectItemType[]>(data);
  const [editing, setEditing] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<ProjectItemType>({
    id: "",
    title: "",
    description: "",
    bulletPoints: [""]
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(projects);
    onNext();
  };

  const handleAddProject = () => {
    const id = Date.now().toString();
    const projectWithId = { ...newProject, id };
    setProjects([...projects, projectWithId]);
    setNewProject({
      id: "",
      title: "",
      description: "",
      bulletPoints: [""]
    });
    setIsAdding(false);
  };

  const handleUpdateProject = (id: string) => {
    setProjects(projects.map(proj => proj.id === id ? 
      { ...projects.find(p => p.id === id) as ProjectItemType } : 
      proj
    ));
    setEditing(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
    if (editing === id) setEditing(null);
  };

  const handleChangeNewProject = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeExistingProject = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [name]: value } : proj
    ));
  };

  const handleAddBulletPoint = (id: string | null) => {
    if (id === null) {
      setNewProject(prev => ({
        ...prev,
        bulletPoints: [...prev.bulletPoints, ""]
      }));
    } else {
      setProjects(projects.map(proj => {
        if (proj.id === id) {
          return {
            ...proj,
            bulletPoints: [...proj.bulletPoints, ""]
          };
        }
        return proj;
      }));
    }
  };

  const handleChangeBulletPoint = (
    id: string | null,
    index: number,
    value: string
  ) => {
    if (id === null) {
      setNewProject(prev => {
        const newBulletPoints = [...prev.bulletPoints];
        newBulletPoints[index] = value;
        return { ...prev, bulletPoints: newBulletPoints };
      });
    } else {
      setProjects(projects.map(proj => {
        if (proj.id === id) {
          const newBulletPoints = [...proj.bulletPoints];
          newBulletPoints[index] = value;
          return { ...proj, bulletPoints: newBulletPoints };
        }
        return proj;
      }));
    }
  };

  const handleDeleteBulletPoint = (id: string | null, index: number) => {
    if (id === null) {
      setNewProject(prev => {
        const newBulletPoints = [...prev.bulletPoints];
        newBulletPoints.splice(index, 1);
        return { ...prev, bulletPoints: newBulletPoints.length ? newBulletPoints : [""] };
      });
    } else {
      setProjects(projects.map(proj => {
        if (proj.id === id) {
          const newBulletPoints = [...proj.bulletPoints];
          newBulletPoints.splice(index, 1);
          return { 
            ...proj, 
            bulletPoints: newBulletPoints.length ? newBulletPoints : [""] 
          };
        }
        return proj;
      }));
    }
  };

  const renderProjectForm = (
    project: ProjectItemType,
    isNew: boolean = false,
    id: string | null = null
  ) => (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title${id || "new"}`}>Project Title</Label>
          <Input
            id={`title${id || "new"}`}
            name="title"
            placeholder="e.g., Accident Detection and Alerting System"
            value={project.title}
            onChange={(e) => 
              isNew 
                ? handleChangeNewProject(e) 
                : handleChangeExistingProject(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description${id || "new"}`}>Short Description</Label>
          <Input
            id={`description${id || "new"}`}
            name="description"
            placeholder="e.g., Accident Detection and Alerting System using Networking"
            value={project.description}
            onChange={(e) => 
              isNew 
                ? handleChangeNewProject(e) 
                : handleChangeExistingProject(id as string, e)
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Bullet Points (Details & Achievements)</Label>
        {project.bulletPoints.map((point, index) => (
          <div key={`${id || "new"}-bullet-${index}`} className="flex gap-2">
            <Textarea
              placeholder="e.g., Developed an automated system to enhance user safety by detecting and responding to potential mishaps."
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
              disabled={project.bulletPoints.length === 1 && index === 0}
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
            <Button type="button" onClick={handleAddProject}>
              Add Project
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleUpdateProject(id as string)}>
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
        <h2 className="text-2xl font-serif font-semibold">Projects</h2>
        <p className="text-muted-foreground">
          Add notable projects that showcase your skills and accomplishments.
        </p>
      </div>

      {projects.length > 0 && (
        <div className="space-y-4">
          {projects.map((proj) => (
            <Card key={proj.id}>
              <CardContent className="p-4">
                {editing === proj.id ? (
                  renderProjectForm(proj, false, proj.id)
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{proj.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {proj.description}
                      </p>
                      <ul className="list-disc list-inside mt-2 text-sm">
                        {proj.bulletPoints.filter(Boolean).map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(proj.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProject(proj.id)}
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
        renderProjectForm(newProject, true)
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Project
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

export default Projects;
