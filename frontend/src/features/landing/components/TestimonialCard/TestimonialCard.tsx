import { motion } from "framer-motion"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
        <Separator className="mb-4" />
        <div className="flex items-center gap-3">
          <Avatar size="default">
            <AvatarFallback className={cn(item.avatarBg)}>{item.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.role}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
