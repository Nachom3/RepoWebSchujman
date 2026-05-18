import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        accent: 'bg-accent text-accent-foreground hover:bg-accent-hover',
        ghost:
          'border border-border-strong bg-transparent text-surface-foreground hover:border-ring hover:text-primary',
        nightGhost:
          'border border-night-muted bg-transparent text-night-foreground hover:border-primary hover:text-primary',
      },
      size: {
        sm: 'text-xs px-3 py-2',
        md: 'text-sm px-4 py-3',
        lg: 'text-base px-5 py-3',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

export const Button = forwardRef(function Button(
  { className, variant, size, fullWidth, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  )
})
