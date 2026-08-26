import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"
import { fadeInUp } from "@/lib/animations"
import { getProjects } from "@/features/proyectos/services/projectService"
import type { Project, ProjectStatus } from "@/features/proyectos"
import { STATUS_LABEL, STATUS_VARIANT } from "@/features/proyectos"

const RECENT_LIMIT = 8

const STATUS_BADGE_CLASS: Partial<Record<ProjectStatus, string>> = {
  FINALIZADA:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
};

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
}

export function RecentProjectsTable() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProjects()
        if (!cancelled) setProjects(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar obras")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProjects()
    return () => {
      cancelled = true
    }
  }, [])

  const recent = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, RECENT_LIMIT),
    [projects],
  )

  return (
    <motion.div {...fadeInUp}>
      <Card surface="glass">
        <CardHeader>
          <CardTitle className="text-base">Obras recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <TableSkeleton />}
          {!loading && error && <p className="text-sm text-destructive">{error}</p>}
          {!loading && !error && recent.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay obras registradas
            </p>
          )}
          {!loading && !error && recent.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Avance</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/proyectos/${project.id}`)}
                  >
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-muted-foreground">#{project.clientId}</TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[project.status]}
                        className={STATUS_BADGE_CLASS[project.status]}
                      >
                        {STATUS_LABEL[project.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">{project.progressPercent}%</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(project.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
