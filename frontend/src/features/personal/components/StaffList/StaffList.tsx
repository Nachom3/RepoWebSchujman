import { motion } from "framer-motion";
import { HardHat, Plus, Phone, Mail, IdCard, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp } from "@/lib/animations";
import { useStaff } from "../../hooks/useStaff";
import {
  staffRoleLabel,
  staffStatusLabel,
  staffStatusClass,
} from "../../presentation";

interface StaffListProps {
  readonly onCreate?: () => void;
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { readonly status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${staffStatusClass(status)}`}
    >
      {staffStatusLabel(status)}
    </span>
  );
}

export function StaffList({ onCreate }: Readonly<StaffListProps>) {
  const { data, isLoading, error } = useStaff();

  return (
    <motion.div {...fadeInUp}>
      <Card surface="glass" padding="none">
        <CardHeader className="px-6 pt-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Personal</CardTitle>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="size-4" /> Agregar personal
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {isLoading ? (
            <ListSkeleton />
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <HardHat className="size-10 mb-3 opacity-40" />
              <p className="text-sm">No hay personal cargado</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.map((member) => (
                <li
                  key={member.id}
                  className="rounded-xl border border-border/50 bg-background/50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{member.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {staffRoleLabel(member.role)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={member.status} />
                      {member.activeAssignments > 0 && (
                        <Badge variant="outline" className="gap-1">
                          <Briefcase className="size-3" />
                          {member.activeAssignments} obra
                          {member.activeAssignments === 1 ? "" : "s"}
                        </Badge>
                      )}
                      <span className="font-mono text-xs text-muted-foreground">
                        ${member.dayRate.toLocaleString("es-AR")}/día
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {member.taxId && (
                      <span className="flex items-center gap-1">
                        <IdCard className="size-3" /> {member.taxId}
                      </span>
                    )}
                    {member.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" /> {member.phone}
                      </span>
                    )}
                    {member.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" /> {member.email}
                      </span>
                    )}
                  </div>
                  {member.notes && (
                    <p className="mt-2 text-xs text-muted-foreground italic">
                      {member.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
