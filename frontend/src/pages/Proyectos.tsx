import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectList, ProjectForm, type ProjectStatus } from "@/features/proyectos";
import { useClients } from "@/features/clientes/hooks/useClients";

export default function Proyectos() {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | undefined>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [listKey, setListKey] = useState(0);

  const { data: clients } = useClients("ACTIVE");

  return (
    <>
      <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Obras</h1>
            <p className="text-muted-foreground">
              Gestioná tus proyectos de construcción: estado, avance y
              presupuestos.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" /> Nueva obra
          </Button>
        </div>

        <ProjectList
          key={listKey}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva obra</DialogTitle>
            <DialogDescription>
              Cargá los datos principales del proyecto para empezar a
              registrar avances y tareas.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            clients={clients}
            onSuccess={() => {
              setIsCreateOpen(false);
              setListKey((current) => current + 1);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
