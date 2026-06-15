import { cva, type VariantProps } from 'class-variance-authority'
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

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof inputVariants> {
  type?: string
}

export function Input({
  className,
  tone,
  type = 'text',
  ...props
}: Readonly<InputProps>) {
  return (
    <input
      type={type}
      className={cn(inputVariants({ tone }), className)}
      {...props}
    />
  )
}
