import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  portalCreateOrderSchema,
  type PortalCreateOrderFormData,
} from "../../types";
import type { PortalNewOrderProps } from "./PortalNewOrder.types";

export function PortalNewOrder({
  onSubmit,
  onCancel,
  isLoading,
  error,
}: PortalNewOrderProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PortalCreateOrderFormData>({
    resolver: zodResolver(portalCreateOrderSchema),
  });

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="formulaId">Fórmula ID</Label>
              <Input
                id="formulaId"
                type="number"
                {...register("formulaId", { valueAsNumber: true })}
              />
              {errors.formulaId && (
                <p className="text-sm text-destructive">
                  {errors.formulaId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad (m³)</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="obraAddress">Dirección de obra</Label>
              <Input id="obraAddress" {...register("obraAddress")} />
              {errors.obraAddress && (
                <p className="text-sm text-destructive">
                  {errors.obraAddress.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Fecha programada (opcional)</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                {...register("scheduledDate")}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Pedido"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
