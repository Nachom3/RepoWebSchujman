import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSiloSchema } from "../../types";
import type { SiloFormProps } from "./SiloForm.types";

export function SiloForm({ initialData, onSubmit, isLoading }: SiloFormProps) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    material: initialData?.material ?? "",
    quantity: initialData?.quantity ?? 0,
    unit: initialData?.unit ?? "",
    alertMin: initialData?.alertMin ?? 0,
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
    const result = createSiloSchema.safeParse(formData);
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
        <Label htmlFor="material">Material *</Label>
        <Input
          id="material"
          value={formData.material}
          onChange={(e) => handleChange("material", e.target.value)}
        />
        {errors.material && <p className="text-red-500 text-sm">{errors.material}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Cantidad *</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity || ""}
          onChange={(e) => handleChange("quantity", parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="unit">Unidad *</Label>
        <Input
          id="unit"
          value={formData.unit}
          onChange={(e) => handleChange("unit", e.target.value)}
        />
        {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="alertMin">Mínimo alerta</Label>
        <Input
          id="alertMin"
          type="number"
          value={formData.alertMin || ""}
          onChange={(e) => handleChange("alertMin", parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : isEdit ? "Actualizar" : "Crear Silo"}
      </Button>
    </form>
  );
}
