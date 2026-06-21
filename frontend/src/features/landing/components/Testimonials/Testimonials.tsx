import { motion } from "framer-motion"

import { testimonials, companyLogos } from "../../data/landing"
import { fadeInUp } from "@/lib/animations"
import { TestimonialCard } from "../TestimonialCard"
import { SectionHeader } from "../SectionHeader"

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Testimonios"
          eyebrowColor="text-[oklch(0.65_0.2_40)]"
          title="Constructoras que ya"
          highlight="confían en ObraCTRL"
        />

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} item={t} index={i} />
          ))}
        </div>

        <motion.div {...fadeInUp}>
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            +50 constructoras ya usan ObraCTRL
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-30">
            {companyLogos.map((logo) => (
              <span
                key={logo.name}
                className="text-xl font-bold"
              >
                {logo.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
