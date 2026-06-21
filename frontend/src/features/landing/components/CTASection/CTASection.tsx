import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { fadeInUp } from "@/lib/animations"

interface CTASectionProps {
  readonly isAuthenticated: boolean
  readonly onNavigate: (path: string) => void
}

export function CTASection({
  isAuthenticated,
  onNavigate,
}: Readonly<CTASectionProps>) {
  return (
    <section className="relative py-20 lg:py-28 bg-night dot-pattern overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-night-foreground tracking-tight leading-tight">
            Dejá de gestionar obras{" "}
            <br className="hidden sm:block" />
            como en los 90
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-night-foreground/60 leading-relaxed max-w-xl mx-auto">
            Probá ObraCTRL gratis por 14 días. Sin compromiso, sin tarjeta de
            crédito. Implementación guiada y soporte 24/7.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
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
                  className="!shadow-xl !shadow-accent/20"
                >
                  Agendar demo personalizada
                </Button>
                <Button
                  variant="nightGhost"
                  size="lg"
                  onClick={() => onNavigate("/register")}
                >
                  Hablar con ventas
                </Button>
              </>
            )}
          </div>
          <p className="mt-6 text-sm text-night-foreground/30">
            Sin compromiso · Cancelá cuando quieras · Datos seguros con
            encriptación JWT
          </p>
        </motion.div>
      </div>
    </section>
  )
}
