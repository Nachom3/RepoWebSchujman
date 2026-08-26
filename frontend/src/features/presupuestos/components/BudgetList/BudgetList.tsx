import { motion } from "framer-motion";
import { FileSpreadsheet, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useBudgets } from "../../hooks/useBudgets";
import { STATUS_LABEL, STATUS_VARIANT } from "../../presentation";

interface BudgetListProps {
  readonly onCreate?: () => void;
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function BudgetList({ onCreate }: Readonly<BudgetListProps>) {
  const { data, isLoading, error } = useBudgets();

  return (
    <motion.div {...fadeInUp}>
      <Card surface="glass" padding="none">
        <CardHeader className="px-6 pt-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Presupuestos</CardTitle>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="size-4" /> Nuevo presupuesto
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {isLoading ? (
            <ListSkeleton />
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileSpreadsheet className="size-10 mb-3 opacity-40" />
              <p className="text-sm">No hay presupuestos cargados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">#{budget.projectId}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[budget.status]}>
                        {STATUS_LABEL[budget.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {budget.items.length}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(budget.total)}
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
