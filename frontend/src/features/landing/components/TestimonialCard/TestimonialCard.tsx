import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"
import { stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"

import type { Testimonial } from "../../data/landing"
import { Stars } from "../Stars"

interface TestimonialCardProps {
  readonly item: Testimonial
  readonly index: number
}

export function TestimonialCard({ item, index }: Readonly<TestimonialCardProps>) {
  return (
    <motion.div {...stagger(index)}>
      <Card surface="solid" padding="md" className="!p-7">
        <Stars />
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed mb-5">
          &ldquo;{item.quote}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
              item.avatarBg,
            )}
          >
            {item.initials}
          </div>
          <div>
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.role}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
