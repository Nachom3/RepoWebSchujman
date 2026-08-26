import { Clock } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { StatsRow } from "../StatsRow/StatsRow"
import { ProjectsByStatusChart } from "../ProjectsByStatusChart/ProjectsByStatusChart"
import { RevenueChart } from "../RevenueChart/RevenueChart"
import { MaterialsStock } from "../MaterialsStock/MaterialsStock"
import { RecentProjectsTable } from "../RecentProjectsTable/RecentProjectsTable"

export function DashboardView() {
  const { user } = useAuth()

  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Dashboard
        </p>
        <h2 className="mt-2 text-3xl font-black">
          Bienvenido, {user?.email?.split("@")[0] ?? "Usuario"}
        </h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-3.5" />
          {today}
        </p>
      </section>

      <section>
        <StatsRow />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <ProjectsByStatusChart />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MaterialsStock />
        <RecentProjectsTable />
      </section>
    </div>
  )
}
