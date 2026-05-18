import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const cardVariants = cva('rounded-3xl border shadow-xl', {
  variants: {
    surface: {
      glass:
        'border-border bg-surface/75 backdrop-blur-md text-surface-foreground',
      solid: 'border-border bg-surface text-surface-foreground',
      night:
        'border-night-muted bg-night/85 backdrop-blur-md text-night-foreground',
    },
    padding: {
      sm: 'p-5',
      md: 'p-8',
      lg: 'p-10',
    },
  },
  defaultVariants: {
    surface: 'glass',
    padding: 'md',
  },
})

export function Card({ surface, padding, className, children, ...props }) {
  return (
    <section
      className={cn(cardVariants({ surface, padding }), className)}
      {...props}
    >
      {children}
    </section>
  )
}
