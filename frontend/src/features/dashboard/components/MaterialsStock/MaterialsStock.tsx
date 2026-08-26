import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Hammer, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { stagger } from "@/lib/animations"
import { getMaterials } from "@/features/materiales/services/materialService"
import type { Material } from "@/features/materiales"

function getStockColor(material: Material): string {
  if (material.isLow) return "bg-destructive"
  if (material.stock <= material.alertMin * 2) return "bg-amber-500"
  return "bg-emerald-500"
}

function getStockPercent(material: Material): number {
  const max = Math.max(material.alertMin * 4, material.stock)
  if (max === 0) return 0
  return Math.min(100, Math.round((material.stock / max) * 100))
}

function MaterialItem({ material, index }: { readonly material: Material; readonly index: number }) {
  const percent = getStockPercent(material)
  const colorClass = getStockColor(material)

  return (
    <motion.div {...stagger(index)}>
      <div
        className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
          material.isLow
            ? "border-destructive/30 bg-destructive/5"
            : "border-border bg-background/50"
        }`}
      >
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
            material.isLow ? "bg-destructive/10" : "bg-muted"
          }`}
        >
          <Hammer className={`size-5 ${material.isLow ? "text-destructive" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium truncate">{material.name}</span>
              {material.isLow && (
                <Badge variant="destructive" className="shrink-0 gap-1">
                  <AlertTriangle className="size-3" /> Bajo
                </Badge>
              )}
            </div>
            <span className="text-sm font-semibold tabular-nums shrink-0">
              {material.stock.toLocaleString("es-AR")} {material.unit.toLowerCase()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border p-4">
          <Skeleton className="size-10 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MaterialsStock() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchMaterials() {
      try {
        const data = await getMaterials()
        if (!cancelled) setMaterials(data)
      } catch {
        if (!cancelled) setHasError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchMaterials()
    return () => {
      cancelled = true
    }
  }, [])

  const lowCount = materials.filter((m) => m.isLow).length

  return (
    <Card surface="glass" padding="md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Hammer className="size-4 text-muted-foreground" />
            Stock de materiales
          </CardTitle>
          {!loading && !hasError && (
            <Badge variant={lowCount > 0 ? "destructive" : "secondary"}>
              {materials.length} materiales{lowCount > 0 ? `, ${lowCount} en nivel bajo` : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="mt-2">
        {loading && <LoadingSkeleton />}
        {hasError && <p className="text-sm text-muted-foreground">No se pudieron cargar los materiales.</p>}
        {!loading && !hasError && materials.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay materiales cargados.</p>
        )}
        {!loading && !hasError && materials.length > 0 && (
          <div className="space-y-3">
            {materials.slice(0, 4).map((material, i) => (
              <MaterialItem key={material.id} material={material} index={i} />
            ))}
            {materials.length > 4 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                Mostrando 4 de {materials.length} materiales
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
