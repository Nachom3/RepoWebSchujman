import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSilos } from "../../hooks/useSilos";
import type { SiloListProps } from "./SiloList.types";

export function SiloList(_props: SiloListProps) {
  const { data: silos, isLoading, error } = useSilos();

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Mínimo</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : silos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No hay silos.
              </TableCell>
            </TableRow>
          ) : (
            silos.map((silo) => (
              <TableRow key={silo.id}>
                <TableCell className="font-medium">{silo.material}</TableCell>
                <TableCell>{silo.quantity}</TableCell>
                <TableCell>{silo.unit}</TableCell>
                <TableCell>{silo.alertMin}</TableCell>
                <TableCell>
                  <Badge variant={silo.isLow ? "destructive" : "default"}>
                    {silo.isLow ? "Bajo" : "OK"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
