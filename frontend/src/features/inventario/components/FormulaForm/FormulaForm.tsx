import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFormulaSchema } from "../../types";
import type { FormulaFormProps } from "./FormulaForm.types";

export function FormulaForm({ initialData, onSubmit, isLoading }: FormulaFormProps) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    recipe: initialData?.recipe ?? "",
    pricePerCubicMeter: initialData?.pricePerCubicMeter ?? 0,
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
    const result = createFormulaSchema.safeParse(formData);
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
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="recipe">Receta</Label>
        <Input
          id="recipe"
          value={formData.recipe}
          onChange={(e) => handleChange("recipe", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pricePerCubicMeter">Precio por m³ *</Label>
        <Input
          id="pricePerCubicMeter"
          type="number"
          value={formData.pricePerCubicMeter || ""}
          onChange={(e) => handleChange("pricePerCubicMeter", parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
        />
        {errors.pricePerCubicMeter && (
          <p className="text-red-500 text-sm">{errors.pricePerCubicMeter}</p>
        )}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : isEdit ? "Actualizar" : "Crear Fórmula"}
      </Button>
    </form>
  );
}
