import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyBarProps } from "./WeeklyBar.types";

export function WeeklyBar({ m3Dispatched }: WeeklyBarProps) {
  const maxCapacity = 100;
  const percentage = Math.min((m3Dispatched / maxCapacity) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>m³ Despachados Esta Semana</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold">{m3Dispatched.toLocaleString()} m³</div>
        <div className="w-full bg-muted rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {percentage.toFixed(1)}% de capacidad semanal
        </p>
      </CardContent>
    </Card>
  );
}
