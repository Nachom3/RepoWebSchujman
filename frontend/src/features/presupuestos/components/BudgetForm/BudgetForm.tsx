import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
import { createBudget } from "../../services/budgetService";
import {
  BUDGET_CATEGORIES,
  createBudgetSchema,
  type CreateBudgetFormData,
} from "../../types";

interface BudgetFormProps {
  readonly onSuccess: () => void;
}

export function BudgetForm({ onSuccess }: Readonly<BudgetFormProps>) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateBudgetFormData>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      projectId: 0,
      status: "BORRADOR",
      notes: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(data: CreateBudgetFormData) {
    setLoading(true);
    try {
      await createBudget({
        projectId: data.projectId,
        status: data.status,
        notes: data.notes,
        items: data.items?.map((item) => ({
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
      toast.success("Presupuesto creado");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID de obra *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  value={field.value ?? "BORRADOR"}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BORRADOR">Borrador</SelectItem>
                    <SelectItem value="ENVIADO">Enviado</SelectItem>
                    <SelectItem value="APROBADO">Aprobado</SelectItem>
                    <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                    <SelectItem value="VENCIDO">Vencido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Ítems del presupuesto</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  description: "",
                  category: "MATERIAL",
                  quantity: 1,
                  unitPrice: 0,
                })
              }
            >
              <Plus className="size-4" /> Agregar ítem
            </Button>
          </div>

          {fields.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Agregá al menos un ítem para completar el presupuesto.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 rounded-lg border border-border/50 p-3"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field: f }) => (
                      <FormItem className="col-span-12 sm:col-span-4">
                        {index === 0 && <FormLabel>Descripción</FormLabel>}
                        <FormControl>
                          <Input placeholder="Ej: Cemento x bolsa" {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.category`}
                    render={({ field: f }) => (
                      <FormItem className="col-span-6 sm:col-span-3">
                        {index === 0 && <FormLabel>Categoría</FormLabel>}
                        <Select value={f.value} onValueChange={f.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BUDGET_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
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
                    name={`items.${index}.quantity`}
                    render={({ field: f }) => (
                      <FormItem className="col-span-3 sm:col-span-2">
                        {index === 0 && <FormLabel>Cant.</FormLabel>}
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={f.value ?? 0}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field: f }) => (
                      <FormItem className="col-span-3 sm:col-span-2">
                        {index === 0 && <FormLabel>Precio</FormLabel>}
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={f.value ?? 0}
                            onChange={(e) => f.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-12 sm:col-span-1 flex items-end justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      aria-label={`Quitar ítem ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear presupuesto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
