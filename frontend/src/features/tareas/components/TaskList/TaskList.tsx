import { motion } from "framer-motion";
import { ListChecks, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp } from "@/lib/animations";
import { useTasks } from "../../hooks/useTasks";
import { STATUS_LABEL, STATUS_VARIANT } from "../../presentation";

interface TaskListProps {
  readonly onCreate?: () => void;
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function TaskList({ onCreate }: Readonly<TaskListProps>) {
  const { data, isLoading, error } = useTasks();

  return (
    <motion.div {...fadeInUp}>
      <Card surface="glass" padding="none">
        <CardHeader className="px-6 pt-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tareas y avance de obra</CardTitle>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <Plus className="size-4" /> Nueva tarea
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {isLoading ? (
            <ListSkeleton />
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ListChecks className="size-10 mb-3 opacity-40" />
              <p className="text-sm">No hay tareas cargadas</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.map((task) => (
                <li
                  key={task.id}
                  className="rounded-xl border border-border/50 bg-background/50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Obra #{task.projectId}
                        {task.stage && ` · ${task.stage}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_VARIANT[task.status]}>
                        {STATUS_LABEL[task.status]}
                      </Badge>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, task.progress))}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
