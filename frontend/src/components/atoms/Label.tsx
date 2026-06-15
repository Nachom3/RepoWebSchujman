import { cn } from '../../lib/cn'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, children, ...props }: Readonly<LabelProps>) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-surface-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  )
}
