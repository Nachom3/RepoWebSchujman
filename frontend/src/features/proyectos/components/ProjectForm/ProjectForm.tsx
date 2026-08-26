import { useState } from "react";
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
import { createProject } from "../../services/projectService";
import { createProjectSchema, type CreateProjectFormData } from "../../types";

interface ProjectFormProps {
  readonly clients: ReadonlyArray<{ id: number; name: string }>;
  readonly onSuccess: (projectId: number) => void;
}

export function ProjectForm({ clients, onSuccess }: Readonly<ProjectFormProps>) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      type: "OTRO",
      status: "PENDIENTE",
      clientId: clients[0]?.id ?? 0,
    },
  });

  async function onSubmit(data: CreateProjectFormData) {
    setLoading(true);
    try {
      const project = await createProject(data);
      toast.success("Obra creada correctamente");
      onSuccess(project.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo crear la obra";
      toast.error(message);
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la obra</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Casa en Las Heras 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number.parseInt(value, 10))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.length === 0 ? (
                      <SelectItem value="__empty" disabled>
                        No hay clientes cargados
                      </SelectItem>
                    ) : (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={String(client.id)}>
                          {client.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de obra</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VIVIENDA">Vivienda</SelectItem>
                    <SelectItem value="LOCAL_COMERCIAL">Local comercial</SelectItem>
                    <SelectItem value="AMPLIACION">Ampliación</SelectItem>
                    <SelectItem value="REMODELACION">Remodelación</SelectItem>
                    <SelectItem value="EDIFICIO">Edificio</SelectItem>
                    <SelectItem value="GALPON">Galpón</SelectItem>
                    <SelectItem value="OTRO">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección de la obra</FormLabel>
              <FormControl>
                <Input placeholder="Calle, ciudad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Alcance, observaciones, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading || clients.length === 0}>
            {loading ? "Creando..." : "Crear obra"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
