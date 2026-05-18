import { cn } from '../../lib/cn'

export function Label({ className, children, ...props }) {
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
