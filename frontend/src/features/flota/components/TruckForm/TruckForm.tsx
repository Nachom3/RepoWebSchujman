import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTruckSchema } from "../../types";
import type { TruckFormProps } from "./TruckForm.types";

export function TruckForm({ initialData, onSubmit, isLoading }: TruckFormProps) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    patente: initialData?.patente ?? "",
    capacity: initialData?.capacity ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = createTruckSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    await onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patente">Patente *</Label>
        <Input
          id="patente"
          value={formData.patente}
          onChange={(e) => handleChange("patente", e.target.value)}
        />
        {errors.patente && <p className="text-red-500 text-sm">{errors.patente}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="capacity">Capacidad (m³) *</Label>
        <Input
          id="capacity"
          type="number"
          value={formData.capacity || ""}
          onChange={(e) => handleChange("capacity", parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
        {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : isEdit ? "Actualizar" : "Crear Camión"}
      </Button>
    </form>
  );
}
