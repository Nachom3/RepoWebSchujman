import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormulas } from "../../hooks/useFormulas";
import type { FormulaListProps } from "./FormulaList.types";

export function FormulaList({ onSelect }: FormulaListProps) {
  const { data: formulas, isLoading, error } = useFormulas();

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Receta</TableHead>
            <TableHead>Precio/m³</TableHead>
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
          ) : formulas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No hay fórmulas.
              </TableCell>
            </TableRow>
          ) : (
            formulas.map((formula) => (
              <TableRow key={formula.id}>
                <TableCell className="font-medium">{formula.name}</TableCell>
                <TableCell>{formula.recipe ?? "-"}</TableCell>
                <TableCell>${formula.pricePerCubicMeter.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelect?.({ id: formula.id, name: formula.name })}
                  >
                    Seleccionar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
