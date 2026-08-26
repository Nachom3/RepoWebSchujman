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
import { SupplierList, SupplierForm } from "@/features/proveedores";

export default function Proveedores() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [listKey, setListKey] = useState(0);

  return (
    <>
      <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
            <p className="text-muted-foreground">
              Administrá la información de tus proveedores y comparadores de
              precios.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" /> Nuevo proveedor
          </Button>
        </div>

        <SupplierList
          key={listKey}
          onCreate={() => setIsCreateOpen(true)}
        />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo proveedor</DialogTitle>
            <DialogDescription>
              Cargá los datos de contacto y condiciones de pago del proveedor.
            </DialogDescription>
          </DialogHeader>
          <SupplierForm
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
