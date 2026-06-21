import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { MovementRowProps } from "./MovementRow.types";

export function MovementRow({ movement }: MovementRowProps) {
  return (
    <TableRow>
      <TableCell>{new Date(movement.fecha).toLocaleDateString()}</TableCell>
      <TableCell>
        <Badge variant={movement.tipo === "DEBITO" ? "default" : "secondary"}>
          {movement.tipo}
        </Badge>
      </TableCell>
      <TableCell>${movement.monto.toLocaleString()}</TableCell>
      <TableCell>{movement.referencia ?? "-"}</TableCell>
    </TableRow>
  );
}