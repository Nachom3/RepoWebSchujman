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
import { StaffList, StaffForm } from "@/features/personal";

export default function Personal() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [listKey, setListKey] = useState(0);

  return (
    <>
      <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Personal</h1>
            <p className="text-muted-foreground">
              Equipo de trabajo: arquitectos, capataces, oficiales y
              ayudantes.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" /> Agregar personal
          </Button>
        </div>

        <StaffList
          key={listKey}
          onCreate={() => setIsCreateOpen(true)}
        />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar personal</DialogTitle>
            <DialogDescription>
              Cargá los datos principales de la persona para sumarla al equipo
              de la constructora.
            </DialogDescription>
          </DialogHeader>
          <StaffForm
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
