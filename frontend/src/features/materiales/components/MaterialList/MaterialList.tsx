import { motion } from "framer-motion";
import { Package, AlertTriangle, Plus, MapPin, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fadeInUp } from "@/lib/animations";
import { useMaterials } from "../../hooks/useMaterials";
import type { Material } from "../../types";

interface MaterialListProps {
  readonly onCreate?: () => void;
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function StockBadge({ material }: { readonly material: Material }) {
  if (material.isLow) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="size-3" /> Bajo
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="bg-emerald-500/10 text-emerald-600 border-transparent"
    >
      OK
    </Badge>
  );
}

export function MaterialList({ onCreate }: Readonly<MaterialListProps>) {
  const { data, isLoading, error } = useMaterials();

  const lowCount = data.filter((m) => m.isLow).length;
  const totalValue = data.reduce(
    (acc, m) => acc + m.stock * m.unitCost,
    0,
  );

  return (
    <motion.div {...fadeInUp}>
      <Card surface="glass" padding="none">
        <CardHeader className="px-6 pt-6 flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Inventario de materiales</CardTitle>
            <p className="text-xs text-muted-foreground">
              {data.length} material{data.length === 1 ? "" : "es"}
              {lowCount > 0 ? ` · ${lowCount} con stock bajo` : ""} · Valor
              estimado ${totalValue.toLocaleString("es-AR")}
            </p>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="size-4" /> Nuevo material
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {isLoading ? (
            <ListSkeleton />
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="size-10 mb-3 opacity-40" />
              <p className="text-sm">No hay materiales cargados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Mínimo</TableHead>
                  <TableHead>Costo unitario</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium">{material.name}</p>
                        {material.location && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" /> {material.location}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {material.category ?? "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {material.stock.toLocaleString("es-AR")}{" "}
                      <span className="text-xs text-muted-foreground">
                        {material.unit.toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {material.alertMin.toLocaleString("es-AR")}{" "}
                      <span className="text-xs">
                        {material.unit.toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      ${material.unitCost.toLocaleString("es-AR")}
                    </TableCell>
                    <TableCell>
                      {material.supplier ? (
                        <span className="flex items-center gap-1 text-sm">
                          <Truck className="size-3 text-muted-foreground" />
                          {material.supplier.name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StockBadge material={material} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
