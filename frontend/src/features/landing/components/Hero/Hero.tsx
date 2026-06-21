import { motion } from "framer-motion"
import { Building2, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { heroMetrics, heroRows, heroBarData } from "../../data/landing"
import { fadeInUp } from "@/lib/animations"

import { DashboardMetric } from "../DashboardMetric"
import { DashboardRow } from "../DashboardRow"

interface HeroProps {
  readonly isAuthenticated: boolean
  readonly onNavigate: (path: string) => void
  readonly scrollTo: (id: string) => void
}

export function Hero({
  isAuthenticated,
  onNavigate,
  scrollTo,
}: Readonly<HeroProps>) {
  return (
    <section
      id="hero"
      className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, color-mix(in oklch, var(--accent) 10%, transparent) 0%, transparent 50%)
        `,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="text-center lg:text-left"
            {...fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[oklch(0.65_0.2_40)]/10 border border-[oklch(0.65_0.2_40)]/30 text-[oklch(0.6_0.18_35)] text-xs font-semibold mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.65_0.2_40)]/40" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[oklch(0.65_0.2_40)]" />
              </span>
              Usado por +50 constructoras en Argentina
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight">
              Controlá tus obras{" "}
              <br className="hidden sm:block" />
              <span className="text-primary">sin perder el margen</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              El software que centraliza obras, materiales, presupuestos y
              comunicación en un solo lugar. Sabé qué pasa en cada obra antes
              de que te llamen.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {isAuthenticated ? (
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => onNavigate("/dashboard")}
                >
                  Ir al dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => onNavigate("/register")}
                  >
                    Agendar demo
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => scrollTo("features")}
                  >
                    Ver funcionalidades
                  </Button>
                </>
              )}
            </div>

            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              {["Sin instalación", "Soporte 24/7", "14 días gratis"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:justify-end"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <motion.div
              className="relative w-full max-w-lg"
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl blur-2xl" />
              <Card
                surface="solid"
                padding="sm"
                className="relative !rounded-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-bold">ObraCTRL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-success"
                      animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      En vivo
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {heroMetrics.map((m) => (
                    <DashboardMetric
                      key={m.label}
                      label={m.label}
                      value={m.value}
                      bg={m.bg}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
                    <span>Obra</span>
                    <span>Avance</span>
                    <span>Margen</span>
                  </div>
                  {heroRows.map((row) => (
                    <DashboardRow
                      key={row.name}
                      name={row.name}
                      pct={row.pct}
                      margin={row.margin}
                      color={row.color}
                    />
                  ))}
                </div>
                <div className="flex items-end gap-1 h-14 pt-1">
                  {heroBarData.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${
                        i === 4 || i === 7 ? "bg-primary" : "bg-primary/20"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Costo mensual por obra — últimos 12 meses
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-12 sm:h-16"
        >
          <path
            d="M0 40 C240 80, 480 0, 720 40 C960 80, 1200 0, 1440 40 L1440 80 L0 80 Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  )
}
