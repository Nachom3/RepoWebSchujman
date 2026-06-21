import { useCases } from "../../data/landing"
import { UseCaseCard } from "../UseCaseCard"
import { SectionHeader } from "../SectionHeader"

export function UseCases() {
  return (
    <section id="use-cases" className="py-20 lg:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Casos prácticos"
          title="Así usan las constructoras"
          highlight="ObraCTRL"
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {useCases.map((uc, i) => (
            <UseCaseCard key={i} item={uc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
