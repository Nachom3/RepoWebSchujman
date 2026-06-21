import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSilos } from "../../hooks/useSilos";
import type { FormulaMaterialEditorProps } from "./FormulaMaterialEditor.types";

export function FormulaMaterialEditor({
  materials,
  onAdd,
  onRemove,
  isLoading,
}: FormulaMaterialEditorProps) {
  const { data: silos } = useSilos();
  const [siloStockId, setSiloStockId] = useState<number>(0);
  const [kgPerCubicMeter, setKgPerCubicMeter] = useState<number>(0);

  const handleAdd = async () => {
    if (siloStockId && kgPerCubicMeter > 0) {
      await onAdd(siloStockId, kgPerCubicMeter);
      setSiloStockId(0);
      setKgPerCubicMeter(0);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>kg/m³</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay materiales asignados.
              </TableCell>
            </TableRow>
          ) : (
            materials.map((mat) => (
              <TableRow key={mat.id}>
                <TableCell>{mat.siloStock.material} ({mat.siloStock.unit})</TableCell>
                <TableCell>{mat.kgPerCubicMeter}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(mat.id)}
                    disabled={isLoading}
                  >
                    Quitar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="siloStockId">Silo</Label>
          <select
            id="siloStockId"
            value={siloStockId}
            onChange={(e) => setSiloStockId(parseInt(e.target.value) || 0)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Seleccionar...</option>
            {silos.map((silo) => (
              <option key={silo.id} value={silo.id}>
                {silo.material} ({silo.unit})
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <Label htmlFor="kgPerCubicMeter">kg/m³</Label>
          <Input
            id="kgPerCubicMeter"
            type="number"
            value={kgPerCubicMeter || ""}
            onChange={(e) => setKgPerCubicMeter(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>
        <Button onClick={handleAdd} disabled={isLoading || !siloStockId || kgPerCubicMeter <= 0}>
          Agregar
        </Button>
      </div>
    </div>
  );
}
