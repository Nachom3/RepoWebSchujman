import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const inputVariants = cva(
  'w-full rounded-xl border bg-surface px-4 py-3 text-sm text-surface-foreground placeholder:text-muted-foreground transition outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-surface',
  {
    variants: {
      tone: {
        default: 'border-border focus:border-ring',
        danger: 'border-danger focus:border-danger focus:ring-danger',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
)

export const Input = forwardRef(function Input(
  { className, tone, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(inputVariants({ tone }), className)}
      {...props}
    />
  )
})
