import type { ReactNode } from "react";

interface ClientInfoFieldProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export function ClientInfoField({ icon, label, value }: ClientInfoFieldProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-right text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
