import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMaterial, getSuppliersForSelect } from "../../services/materialService";
import {
  createMaterialSchema,
  MATERIAL_CATEGORIES,
  type CreateMaterialFormData,
  type MaterialSupplierOption,
} from "../../types";

interface MaterialFormProps {
  readonly onSuccess: () => void;
}

export function MaterialForm({ onSuccess }: Readonly<MaterialFormProps>) {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<MaterialSupplierOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    getSuppliersForSelect()
      .then((list) => {
        if (!cancelled) setSuppliers(list);
      })
      .catch(() => {
        // silently fail, supplier select will just be empty
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const form = useForm<CreateMaterialFormData>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      name: "",
      unit: "UNIDAD",
      stock: 0,
      alertMin: 0,
      minStock: 0,
      unitCost: 0,
      supplierId: null,
    },
  });

  async function onSubmit(data: CreateMaterialFormData) {
    setLoading(true);
    try {
      await createMaterial({
        ...data,
        supplierId: data.supplierId ?? null,
      });
      toast.success("Material creado");
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo crear el material";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cemento Portland" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  value={field.value ?? "__none"}
                  onValueChange={(v) => field.onChange(v === "__none" ? undefined : v)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__none">Sin categoría</SelectItem>
                    {MATERIAL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="KG">Kilogramo</SelectItem>
                    <SelectItem value="TN">Tonelada</SelectItem>
                    <SelectItem value="M3">Metro cúbico</SelectItem>
                    <SelectItem value="LT">Litro</SelectItem>
                    <SelectItem value="UNIDAD">Unidad</SelectItem>
                    <SelectItem value="BOLSA">Bolsa</SelectItem>
                    <SelectItem value="M2">Metro cuadrado</SelectItem>
                    <SelectItem value="ML">Metro lineal</SelectItem>
                    <SelectItem value="OTRO">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <Select
                  value={field.value === null || field.value === undefined ? "__none" : String(field.value)}
                  onValueChange={(v) => field.onChange(v === "__none" ? null : Number(v))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__none">Sin proveedor</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={String(supplier.id)}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo unitario</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock actual</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alertMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock mínimo (alerta)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Depósito central, Obra Las Heras 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear material"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
