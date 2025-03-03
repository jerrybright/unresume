
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CertificationType } from "@/types/resume";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

interface CertificationsProps {
  data: CertificationType[];
  updateData: (data: CertificationType[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const Certifications = ({ data, updateData, onNext, onBack }: CertificationsProps) => {
  const [certifications, setCertifications] = useState<CertificationType[]>(data);
  const [editing, setEditing] = useState<string | null>(null);
  const [newCertification, setNewCertification] = useState<CertificationType>({
    id: "",
    name: "",
    issuer: ""
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(certifications);
    onNext();
  };

  const handleAddCertification = () => {
    const id = Date.now().toString();
    const certificationWithId = { ...newCertification, id };
    setCertifications([...certifications, certificationWithId]);
    setNewCertification({
      id: "",
      name: "",
      issuer: ""
    });
    setIsAdding(false);
  };

  const handleUpdateCertification = (id: string) => {
    setCertifications(certifications.map(cert => cert.id === id ? 
      { ...certifications.find(c => c.id === id) as CertificationType } : 
      cert
    ));
    setEditing(null);
  };

  const handleDeleteCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
    if (editing === id) setEditing(null);
  };

  const handleChangeNewCertification = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewCertification(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeExistingCertification = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [name]: value } : cert
    ));
  };

  const renderCertificationForm = (
    cert: CertificationType,
    isNew: boolean = false,
    id: string | null = null
  ) => (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`name${id || "new"}`}>Certification Name</Label>
          <Input
            id={`name${id || "new"}`}
            name="name"
            placeholder="e.g., Mastering Figma Beginner to Expert"
            value={cert.name}
            onChange={(e) => 
              isNew 
                ? handleChangeNewCertification(e) 
                : handleChangeExistingCertification(id as string, e)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`issuer${id || "new"}`}>Issuing Organization</Label>
          <Input
            id={`issuer${id || "new"}`}
            name="issuer"
            placeholder="e.g., GUVI"
            value={cert.issuer}
            onChange={(e) => 
              isNew 
                ? handleChangeNewCertification(e) 
                : handleChangeExistingCertification(id as string, e)
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
            <Button type="button" onClick={handleAddCertification}>
              Add Certification
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleUpdateCertification(id as string)}>
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
        <h2 className="text-2xl font-serif font-semibold">Certifications</h2>
        <p className="text-muted-foreground">
          Add any professional certifications or courses you've completed.
        </p>
      </div>

      {certifications.length > 0 && (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.id}>
              <CardContent className="p-4">
                {editing === cert.id ? (
                  renderCertificationForm(cert, false, cert.id)
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(cert.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCertification(cert.id)}
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
        renderCertificationForm(newCertification, true)
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Certification
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

export default Certifications;
