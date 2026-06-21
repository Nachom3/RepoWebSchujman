import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { useToggleTruck } from "../../hooks/useToggleTruck";
import type { TruckRowProps } from "./TruckRow.types";

export function TruckRow({ truck }: TruckRowProps) {
  const { mutate: toggle, isLoading } = useToggleTruck();

  const handleToggle = async () => {
    await toggle(truck.id);
    window.location.reload();
  };

  return (
    <TableRow>
      <TableCell className="font-mono">{truck.patente}</TableCell>
      <TableCell>{truck.capacity}</TableCell>
      <TableCell>
        <Badge variant={truck.status === "DISPONIBLE" ? "default" : "secondary"}>
          {truck.status === "DISPONIBLE" ? "Disponible" : "En Recorrido"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          disabled={isLoading}
        >
          {isLoading ? "Cambiando..." : truck.status === "DISPONIBLE" ? "Marcar En Recorrido" : "Marcar Disponible"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
