import { motion } from 'framer-motion'
import { fadeInUp } from '../../lib/animations'

export interface SectionHeaderProps {
  readonly eyebrow: string
  readonly eyebrowColor?: string
  readonly title: string
  readonly highlight?: string
  readonly subtitle?: string
}

export function SectionHeader({
  eyebrow,
  eyebrowColor = 'text-primary',
  title,
  highlight,
  subtitle,
}: Readonly<SectionHeaderProps>) {
  return (
    <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeInUp}>
      <span className={`text-sm font-semibold ${eyebrowColor} uppercase tracking-wider`}>
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
        {title}{' '}
        {highlight && <span className="text-primary">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
      )}
    </motion.div>
  )
}
