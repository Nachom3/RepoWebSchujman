import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const alertVariants = cva(
  'rounded-xl border px-3 py-2 text-sm',
  {
    variants: {
      variant: {
        danger: 'border-danger bg-danger-soft text-danger-soft-foreground',
        success: 'border-success bg-success/10 text-success',
        info: 'border-border bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  role?: string
}

export function Alert({
  className,
  variant,
  children,
  role = 'alert',
  ...props
}: Readonly<AlertProps>) {
  return (
    <div
      role={role}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}
