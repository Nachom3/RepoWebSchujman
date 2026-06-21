import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PeakHourListProps } from "./PeakHourList.types";

export function PeakHourList({ peakHours }: PeakHourListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas Pico (Últimos 30 días)</CardTitle>
      </CardHeader>
      <CardContent>
        {peakHours.length === 0 ? (
          <p className="text-muted-foreground text-sm">No hay datos disponibles.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Pedidos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peakHours.map(({ hour, count }) => (
                <TableRow key={hour}>
                  <TableCell>
                    {hour.toString().padStart(2, "0")}:00
                  </TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
