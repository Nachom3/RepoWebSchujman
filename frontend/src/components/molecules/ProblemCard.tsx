import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { stagger } from '../../lib/animations'
import { Card } from './Card'
import type { Problem } from '../../data/landing'

export interface ProblemCardProps {
  readonly item: Problem
  readonly index: number
}

export function ProblemCard({ item, index }: Readonly<ProblemCardProps>) {
  return (
    <motion.div
      className="group"
      {...stagger(index)}
    >
      <Card
        surface="solid"
        padding="md"
        className="!rounded-2xl hover:border-primary/40 hover:shadow-lg transition-all duration-300"
      >
      <div className="flex items-start gap-4">
        <motion.div
          className="flex-shrink-0 w-11 h-11 bg-danger/10 rounded-xl flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <AlertTriangle className="w-5 h-5 text-danger" />
        </motion.div>
        <div>
          <p className="text-xs font-semibold text-danger/70 uppercase tracking-wider mb-1">
            Sin ObraCTRL
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.before}</p>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-border flex items-start gap-4">
        <motion.div
          className="flex-shrink-0 w-11 h-11 bg-success/10 rounded-xl flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <CheckCircle className="w-5 h-5 text-success" />
        </motion.div>
        <div>
          <p className="text-xs font-semibold text-success uppercase tracking-wider mb-1">
            Con ObraCTRL
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-surface-foreground">
              {item.after.split('.')[0]}
            </strong>
            .{item.after.split('.').slice(1).join('.')}
          </p>
        </div>
      </div>
      </Card>
    </motion.div>
  )
}
