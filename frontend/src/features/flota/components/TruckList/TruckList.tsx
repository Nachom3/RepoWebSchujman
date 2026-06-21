import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTrucks } from "../../hooks/useTrucks";
import { TruckRow } from "../TruckRow";
import type { TruckListProps } from "./TruckList.types";

export function TruckList(_props: TruckListProps) {
  const { data: trucks, isLoading, error } = useTrucks();

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patente</TableHead>
            <TableHead>Capacidad (m³)</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : trucks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No hay camiones.
              </TableCell>
            </TableRow>
          ) : (
            trucks.map((truck) => (
              <TruckRow key={truck.id} truck={truck} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
