import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientSchema, updateClientSchema } from "../../types";
import type { ClientFormProps } from "./ClientForm.types";

export function ClientForm({ initialData, onSubmit, isLoading }: ClientFormProps) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    cuit: initialData?.cuit ?? "",
    razonSocial: initialData?.razonSocial ?? "",
    direccion: initialData?.direccion ?? "",
    telefono: initialData?.telefono ?? "",
    email: initialData?.email ?? "",
    contacto: initialData?.contacto ?? "",
    condicionIVA: initialData?.condicionIVA ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
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
    const schema = isEdit ? updateClientSchema : createClientSchema;
    const result = schema.safeParse(formData);
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
        <Label htmlFor="cuit">CUIT</Label>
        <Input
          id="cuit"
          value={formData.cuit}
          onChange={(e) => handleChange("cuit", e.target.value)}
          disabled={isEdit}
          placeholder="XX-XXXXXXXX-X"
        />
        {errors.cuit && <p className="text-red-500 text-sm">{errors.cuit}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="razonSocial">Razón Social *</Label>
        <Input
          id="razonSocial"
          value={formData.razonSocial}
          onChange={(e) => handleChange("razonSocial", e.target.value)}
        />
        {errors.razonSocial && (
          <p className="text-red-500 text-sm">{errors.razonSocial}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          value={formData.direccion}
          onChange={(e) => handleChange("direccion", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          value={formData.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contacto">Contacto</Label>
        <Input
          id="contacto"
          value={formData.contacto}
          onChange={(e) => handleChange("contacto", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="condicionIVA">Condición IVA</Label>
        <Input
          id="condicionIVA"
          value={formData.condicionIVA}
          onChange={(e) => handleChange("condicionIVA", e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : isEdit ? "Actualizar" : "Crear Cliente"}
      </Button>
    </form>
  );
}