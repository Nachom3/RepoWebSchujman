import { useState } from 'react'
import { Card } from '../molecules/Card'
import { FormField } from '../molecules/FormField'
import { Button } from '../atoms/Button'
import { Alert } from '../atoms/Alert'

interface AuthFormProps {
  readonly eyebrow?: string
  readonly title: string
  readonly subtitle?: string
  readonly submitLabel: string
  readonly loadingLabel?: string
  readonly onSubmit: (form: { email: string; password: string }) => Promise<void>
  readonly error?: string
  readonly loading?: boolean
  readonly footer?: React.ReactNode
  readonly accent?: 'primary' | 'accent'
  readonly passwordMinLength?: number
  readonly passwordAutoComplete?: string
}

export function AuthForm({
  eyebrow,
  title,
  subtitle,
  submitLabel,
  loadingLabel = 'Procesando...',
  onSubmit,
  error,
  loading,
  footer,
  accent = 'primary',
  passwordMinLength = 8,
  passwordAutoComplete = 'current-password',
}: Readonly<AuthFormProps>) {
  const [form, setForm] = useState({ email: '', password: '' })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit(form)
  }

  const eyebrowColor =
    accent === 'accent' ? 'text-accent-foreground' : 'text-primary'

  return (
    <main className="auth-grid-bg min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-md">
        {eyebrow ? (
          <p
            className={`text-xs uppercase tracking-[0.3em] font-semibold ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-black text-surface-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <FormField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={passwordMinLength}
            autoComplete={passwordAutoComplete}
          />

          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Button
            type="submit"
            variant={accent}
            fullWidth
            disabled={loading}
          >
            {loading ? loadingLabel : submitLabel}
          </Button>
        </form>

        {footer ? (
          <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
        ) : null}
      </Card>
    </main>
  )
}
