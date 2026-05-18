import { useId } from 'react'
import { Input } from '../atoms/Input'
import { Label } from '../atoms/Label'
import { cn } from '../../lib/cn'

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  required,
  minLength,
  autoComplete,
  className,
  inputClassName,
}) {
  const fieldId = useId()
  const describedById = error || hint ? `${fieldId}-desc` : undefined

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={describedById}
        tone={error ? 'danger' : 'default'}
        className={inputClassName}
      />
      {error ? (
        <p id={describedById} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={describedById} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
