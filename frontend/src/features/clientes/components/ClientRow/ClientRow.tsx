import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ClientRowProps } from "./ClientRow.types";

export function ClientRow({ client, onClick }: ClientRowProps) {
  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onClick?.(client)}
    >
      <TableCell className="font-mono">{client.cuit}</TableCell>
      <TableCell>{client.razonSocial}</TableCell>
      <TableCell>${client.saldo.toLocaleString()}</TableCell>
      <TableCell>
        <Badge variant={client.status === "active" ? "default" : "secondary"}>
          {client.status === "active" ? "Activo" : "Deshabilitado"}
        </Badge>
      </TableCell>
    </TableRow>
  );
}