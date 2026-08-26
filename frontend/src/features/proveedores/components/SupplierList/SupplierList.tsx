import { motion } from "framer-motion";
import { Truck, Plus, Phone, Mail, MapPin, Globe, FileText, Package, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp } from "@/lib/animations";
import { useSuppliers } from "../../hooks/useSuppliers";
import type { Supplier } from "../../types";

interface SupplierListProps {
  readonly onCreate?: () => void;
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function ContactRow({
  icon,
  value,
}: {
  readonly icon: React.ReactNode;
  readonly value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <span className="flex items-center gap-1">
      {icon} {value}
    </span>
  );
}

function SupplierCard({ supplier }: { readonly supplier: Supplier }) {
  return (
    <li className="rounded-xl border border-border/50 bg-background/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">{supplier.name}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {supplier.category && <span>{supplier.category}</span>}
            {supplier.taxId && <span className="font-mono">{supplier.taxId}</span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {supplier.materialsCount > 0 && (
            <Badge variant="outline" className="gap-1">
              <Package className="size-3" />
              {supplier.materialsCount} material
              {supplier.materialsCount === 1 ? "" : "es"}
            </Badge>
          )}
        </div>
      </div>
      {supplier.contactName && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <User className="size-3.5 text-muted-foreground" />
          <span>
            Contacto:{" "}
            <strong className="text-foreground">{supplier.contactName}</strong>
          </span>
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <ContactRow icon={<Phone className="size-3" />} value={supplier.phone} />
        <ContactRow icon={<Mail className="size-3" />} value={supplier.email} />
        <ContactRow icon={<Globe className="size-3" />} value={supplier.website} />
        <ContactRow icon={<MapPin className="size-3" />} value={supplier.address} />
      </div>
      {(supplier.paymentTerms || supplier.notes) && (
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          {supplier.paymentTerms && (
            <p className="flex items-center gap-1">
              <FileText className="size-3" />
              <span>Pago: {supplier.paymentTerms}</span>
            </p>
          )}
          {supplier.notes && <p className="italic">{supplier.notes}</p>}
        </div>
      )}
    </li>
  );
}

export function SupplierList({ onCreate }: Readonly<SupplierListProps>) {
  const { data, isLoading, error } = useSuppliers();

  return (
    <motion.div {...fadeInUp}>
      <Card surface="glass" padding="none">
        <CardHeader className="px-6 pt-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Proveedores</CardTitle>
            <p className="text-xs text-muted-foreground">
              {data.length} proveedor{data.length === 1 ? "" : "es"} cargado
              {data.length === 1 ? "" : "s"}
            </p>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="size-4" /> Nuevo proveedor
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {isLoading ? (
            <ListSkeleton />
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Truck className="size-10 mb-3 opacity-40" />
              <p className="text-sm">No hay proveedores cargados</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
