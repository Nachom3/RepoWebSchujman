import { motion } from "framer-motion"
import { LayoutDashboard } from "lucide-react"

import { demoNavItems, demoMetrics, demoActivity } from "../../data/landing"
import { fadeInUp } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { SectionHeader } from "../SectionHeader"

const metricColorMap: Record<string, string> = {
  "primary-foreground": "text-night-foreground",
  "success-foreground": "text-success",
  "danger-foreground": "text-[oklch(0.65_0.2_40)]",
}

interface DemoProps {
  readonly onNavigate: (path: string) => void
}

export function Demo({ onNavigate }: Readonly<DemoProps>) {
  return (
    <section id="demo" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Demo interactiva"
          title="Mirá ObraCTRL en acción"
          subtitle="Este es un vistazo al panel que usan los gerentes de obra todos los días. Datos reales, decisiones rápidas."
        />

        <motion.div className="max-w-4xl mx-auto" {...fadeInUp}>
          <div className="bg-night rounded-2xl shadow-2xl overflow-hidden border border-night-muted">
            <div className="flex items-center gap-2 px-5 py-3 bg-night-muted/50 border-b border-night-muted">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-3 text-xs text-night-foreground/40 font-medium">
                app.obractrl.com/dashboard
              </span>
            </div>
            <div className="p-5 sm:p-7 grid lg:grid-cols-3 gap-5">
              <div className="hidden lg:block space-y-1.5">
                {demoNavItems.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      item.active
                        ? "bg-primary/20 text-primary-foreground"
                        : "text-night-foreground/40 hover:text-night-foreground hover:bg-white/5",
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {item.label}
                  </div>
                ))}
              </div>
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-4 gap-3">
                  {demoMetrics.map((m) => (
                    <div
                      key={m.label}
                      className="bg-night-muted rounded-xl p-3 text-center"
                    >
                      <p className="text-xs text-night-foreground/40 mb-1">
                        {m.label}
                      </p>
                      <p
                        className={cn(
                          "text-xl font-bold",
                          metricColorMap[m.fg],
                        )}
                      >
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-night-muted rounded-xl p-4">
                  <p className="text-xs font-semibold text-night-foreground/40 uppercase tracking-wider mb-3">
                    Últimas novedades
                  </p>
                  <div className="space-y-2.5">
                    {demoActivity.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            item.dot,
                          )}
                        />
                        <span className="text-night-foreground/70">
                          {item.text}
                        </span>
                        <span className="text-night-foreground/30 text-xs ml-auto">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Esta es una vista previa simulada.{" "}
            <button
              onClick={() => onNavigate("/register")}
              className="text-primary underline underline-offset-2 font-medium hover:text-primary/80"
            >
              Agendá una demo
            </button>{" "}
            para ver el producto real.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
