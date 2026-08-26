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
import { BudgetList, BudgetForm } from "@/features/presupuestos";

export default function Presupuestos() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [listKey, setListKey] = useState(0);

  return (
    <>
      <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Presupuestos</h1>
            <p className="text-muted-foreground">
              Cotizaciones por obra: materiales, mano de obra, servicios y
              maquinaria.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" /> Nuevo presupuesto
          </Button>
        </div>

        <BudgetList key={listKey} onCreate={() => setIsCreateOpen(true)} />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nuevo presupuesto</DialogTitle>
            <DialogDescription>
              Armá un presupuesto para una obra con sus ítems por categoría.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
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
