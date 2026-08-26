import { useState } from "react";
import { HardHat, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  PROJECT_STAFF_STATUSES,
  PROJECT_STAFF_STATUS_LABELS,
  STAFF_ROLES,
  STAFF_ROLE_LABELS,
  createProjectStaffSchema,
  getStaff,
  projectStaffStatusClass,
  projectStaffStatusLabel,
  staffRoleLabel,
  useProjectStaff,
  type CreateProjectStaffFormData,
  type ProjectStaffAssignment,
  type StaffMember,
  type UpdateProjectStaffFormData,
} from "@/features/personal";

interface ProjectTeamSectionProps {
  readonly projectId: number;
}

function TeamSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }: { readonly status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${projectStaffStatusClass(status)}`}
    >
      {projectStaffStatusLabel(status)}
    </span>
  );
}

function TeamRow({ assignment }: { readonly assignment: ProjectStaffAssignment }) {
  const initial = assignment.staff.fullName.charAt(0).toUpperCase();
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
        {initial}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium leading-none">{assignment.staff.fullName}</p>
          <Badge variant="secondary" className="text-xs">
            {staffRoleLabel(assignment.role)}
          </Badge>
          <StatusPill status={assignment.status} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {assignment.responsibility && (
            <span>{assignment.responsibility}</span>
          )}
          {assignment.supervisor && (
            <span>Reporta a: {assignment.supervisor.fullName}</span>
          )}
          {assignment.subordinatesCount > 0 && (
            <span>
              {assignment.subordinatesCount} subordinado
              {assignment.subordinatesCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        {assignment.notes && (
          <p className="text-xs text-muted-foreground italic">{assignment.notes}</p>
        )}
      </div>
    </div>
  );
}

interface AssignFormProps {
  readonly onSubmit: (data: CreateProjectStaffFormData) => Promise<void>;
  readonly availableStaff: StaffMember[];
  readonly onCancel: () => void;
}

function AssignStaffForm({ onSubmit, availableStaff, onCancel }: Readonly<AssignFormProps>) {
  const form = useForm<CreateProjectStaffFormData>({
    resolver: zodResolver(createProjectStaffSchema),
    defaultValues: {
      staffId: availableStaff[0]?.id ?? 0,
      role: "OTRO",
      status: "ASSIGNED",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(data: CreateProjectStaffFormData) {
    setSubmitting(true);
    try {
      await onSubmit(data);
      toast.success("Asignación creada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo asignar");
    } finally {
      setSubmitting(false);
    }
  }

  if (availableStaff.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay personal disponible para asignar. Cargá personal en el módulo
        correspondiente.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar persona" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableStaff.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.fullName} · {staffRoleLabel(member.role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol en la obra</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STAFF_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {STAFF_ROLE_LABELS[role]}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROJECT_STAFF_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {PROJECT_STAFF_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="responsibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsabilidad</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Ej: Dirección técnica, coordinación de cuadrilla"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Asignando..." : "Asignar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ProjectTeamSection({ projectId }: Readonly<ProjectTeamSectionProps>) {
  const { data, isLoading, error, assign, remove } = useProjectStaff(projectId);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  async function handleOpenAssign() {
    setIsAssignOpen(true);
    setLoadingStaff(true);
    try {
      const list = await getStaff();
      const assignedIds = new Set(data.map((d) => d.staffId));
      setAvailableStaff(list.filter((m) => !assignedIds.has(m.id)));
    } catch {
      toast.error("No se pudo cargar el personal disponible");
    } finally {
      setLoadingStaff(false);
    }
  }

  async function handleRemove(assignmentId: number) {
    try {
      await remove(assignmentId);
      toast.success("Asignación eliminada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  }

  async function handleAssign(payload: CreateProjectStaffFormData) {
    await assign(payload);
    setIsAssignOpen(false);
  }

  return (
    <Card surface="glass" padding="md">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <HardHat className="size-4 text-muted-foreground" />
            Equipo de la obra
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {data.length}{" "}
            {data.length === 1 ? "persona asignada" : "personas asignadas"}
          </p>
        </div>
        <Button size="sm" onClick={handleOpenAssign}>
          <Plus className="size-4" /> Asignar personal
        </Button>
      </CardHeader>
      <CardContent className="mt-3 space-y-3">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {isLoading ? (
          <TeamSkeleton />
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <HardHat className="size-10 mb-3 opacity-40" />
            <p className="text-sm">Aún no hay personal asignado a esta obra.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((assignment) => (
              <div key={assignment.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <TeamRow assignment={assignment} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(assignment.id)}
                >
                  Quitar
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Asignar personal a la obra</DialogTitle>
            <DialogDescription>
              Seleccioná una persona de la constructora y definí su rol dentro
              de la obra.
            </DialogDescription>
          </DialogHeader>
          {loadingStaff ? (
            <p className="text-sm text-muted-foreground">Cargando personal...</p>
          ) : (
            <AssignStaffForm
              onSubmit={handleAssign}
              availableStaff={availableStaff}
              onCancel={() => setIsAssignOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export type { UpdateProjectStaffFormData };
