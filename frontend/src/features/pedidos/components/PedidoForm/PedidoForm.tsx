import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrderSchema } from "../../types";
import type { PedidoFormProps } from "./PedidoForm.types";

export function PedidoForm({ onSubmit, isLoading }: PedidoFormProps) {
  const [formData, setFormData] = useState({
    clientId: 0,
    formulaId: 0,
    quantity: 0,
    deliveryDate: "",
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
    const result = createOrderSchema.safeParse({
      ...formData,
      deliveryDate: formData.deliveryDate || undefined,
    });
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
        <Label htmlFor="clientId">Client ID *</Label>
        <Input
          id="clientId"
          type="number"
          value={formData.clientId || ""}
          onChange={(e) => handleChange("clientId", parseInt(e.target.value) || 0)}
        />
        {errors.clientId && <p className="text-red-500 text-sm">{errors.clientId}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="formulaId">Formula ID *</Label>
        <Input
          id="formulaId"
          type="number"
          value={formData.formulaId || ""}
          onChange={(e) => handleChange("formulaId", parseInt(e.target.value) || 0)}
        />
        {errors.formulaId && <p className="text-red-500 text-sm">{errors.formulaId}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Cantidad (m³) *</Label>
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
        <Label htmlFor="deliveryDate">Fecha de entrega</Label>
        <Input
          id="deliveryDate"
          type="date"
          value={formData.deliveryDate}
          onChange={(e) => handleChange("deliveryDate", e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creando..." : "Crear Pedido"}
      </Button>
    </form>
  );
}
