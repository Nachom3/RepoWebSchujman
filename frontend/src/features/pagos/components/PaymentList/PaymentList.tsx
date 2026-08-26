import { motion } from "framer-motion";
import { DollarSign, Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp } from "@/lib/animations";
import { usePayments } from "../../hooks/usePayments";
import { TYPE_LABEL, TYPE_VARIANT, METHOD_LABEL } from "../../presentation";

interface PaymentListProps {
  readonly onCreate?: () => void;
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR");
}

export function PaymentList({ onCreate }: Readonly<PaymentListProps>) {
  const { data, isLoading, error } = usePayments();

  const cobros = data.filter((p) => p.type === "COBRO");
  const gastos = data.filter((p) => p.type === "GASTO");
  const totalCobros = cobros.reduce((acc, p) => acc + p.amount, 0);
  const totalGastos = gastos.reduce((acc, p) => acc + p.amount, 0);

  return (
    <motion.div {...fadeInUp} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card surface="glass" padding="md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <ArrowDownLeft className="size-4 text-emerald-500" /> Cobros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{formatCurrency(totalCobros)}</p>
            <p className="text-xs text-muted-foreground">{cobros.length} movimientos</p>
          </CardContent>
        </Card>
        <Card surface="glass" padding="md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <ArrowUpRight className="size-4 text-destructive" /> Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{formatCurrency(totalGastos)}</p>
            <p className="text-xs text-muted-foreground">{gastos.length} movimientos</p>
          </CardContent>
        </Card>
        <Card surface="glass" padding="md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <DollarSign className="size-4" /> Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold tabular-nums ${totalCobros - totalGastos >= 0 ? "text-emerald-600" : "text-destructive"}`}
            >
              {formatCurrency(totalCobros - totalGastos)}
            </p>
            <p className="text-xs text-muted-foreground">Cobros - Gastos</p>
          </CardContent>
        </Card>
      </div>

      <Card surface="glass" padding="none">
        <CardHeader className="px-6 pt-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Movimientos</CardTitle>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="size-4" /> Nuevo movimiento
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {isLoading ? (
            <ListSkeleton />
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <DollarSign className="size-10 mb-3 opacity-40" />
              <p className="text-sm">No hay pagos registrados</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {data.map((payment) => (
                <li
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={TYPE_VARIANT[payment.type]}>
                      {TYPE_LABEL[payment.type]}
                    </Badge>
                    <span className="text-sm">
                      {payment.reference ?? payment.notes ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-xs text-muted-foreground">
                      {METHOD_LABEL[payment.method]} · {formatDate(payment.date)}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${payment.type === "COBRO" ? "text-emerald-600" : "text-destructive"}`}
                    >
                      {payment.type === "COBRO" ? "+" : "-"}
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
