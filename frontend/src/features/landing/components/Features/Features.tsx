import { problems } from "../../data/landing"
import { ProblemCard } from "../ProblemCard"
import { SectionHeader } from "../SectionHeader"

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="El problema"
          eyebrowColor="text-[oklch(0.65_0.2_40)]"
          title="Gestionar una constructora sin software"
          highlight="cuesta caro"
          subtitle="Los métodos tradicionales — llamadas, WhatsApp, planillas Excel — generan sobrecostos, demoras y decisiones a ciegas. ObraCTRL te da visibilidad total."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <ProblemCard key={i} item={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
