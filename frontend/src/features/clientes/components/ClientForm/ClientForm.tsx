import { useState } from "react";
import { User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientSchema, updateClientSchema } from "../../types";
import type { ClientFormProps } from "./ClientForm.types";

export function ClientForm({ initialData, onSubmit, isLoading }: ClientFormProps) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    taxId: initialData?.taxId ?? "",
    name: initialData?.name ?? "",
    address: initialData?.address ?? "",
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    contactName: initialData?.contactName ?? "",
    notes: initialData?.notes ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
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
    <Card surface="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {isEdit ? "Editar Cliente" : "Crear Cliente"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre / Razón social *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej: Constructora del Sur"
            />
            {errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">CUIT / DNI</Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => handleChange("taxId", e.target.value)}
              disabled={isEdit}
              placeholder="20-12345678-9"
              className="font-mono"
            />
            {errors.taxId && (
              <p className="text-sm text-destructive" role="alert">
                {errors.taxId}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
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
              {errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Persona de contacto</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Guardando..." : isEdit ? "Actualizar" : "Crear Cliente"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
