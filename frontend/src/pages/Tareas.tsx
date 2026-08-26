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
import { TaskList, TaskForm } from "@/features/tareas";

export default function Tareas() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [listKey, setListKey] = useState(0);

  return (
    <>
      <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Tareas</h1>
            <p className="text-muted-foreground">
              Etapas, tareas y avance por obra. Mantené el registro diario desde
              cualquier dispositivo.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" /> Nueva tarea
          </Button>
        </div>

        <TaskList key={listKey} onCreate={() => setIsCreateOpen(true)} />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
            <DialogDescription>
              Registrá una tarea asociada a una obra para llevar el avance y
              estado por equipo.
            </DialogDescription>
          </DialogHeader>
          <TaskForm
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
