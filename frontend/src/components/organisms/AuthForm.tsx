import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { Card } from '../molecules/Card'
import { FormField } from '../molecules/FormField'
import { Button } from '../atoms/Button'
import { Alert } from '../atoms/Alert'

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
}) {
  const [form, setForm] = useState({ email: '', password: '' })

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit(form)
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-surface text-surface-foreground selection:bg-primary/30"
      style={{
        background: `
          radial-gradient(ellipse at 20% 0%, color-mix(in oklch, var(--color-primary) 12%, transparent) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 100%, color-mix(in oklch, var(--color-accent) 10%, transparent) 0%, transparent 50%)
        `,
      }}
    >
      {/* Patrón de puntos idéntico al de la Landing */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      {/* Tarjeta estilo "Hero mockup" */}
      <Card className="relative z-10 w-full max-w-md bg-surface/95 backdrop-blur-md rounded-2xl border border-border shadow-xl p-8 sm:p-10">
        
        <div className="flex flex-col items-center text-center mb-8">
          {/* Logo ObraCTRL */}
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 mb-5">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>

          {eyebrow ? (
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {eyebrow}
            </span>
          ) : null}

          <h1 className="text-3xl font-extrabold tracking-tight">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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

          <div className="pt-2">
            <Button
              type="submit"
              variant={accent}
              fullWidth
              disabled={loading}
              className="rounded-lg font-bold"
            >
              {loading ? loadingLabel : submitLabel}
            </Button>
          </div>
        </form>

        {footer ? (
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </Card>
    </main>
  )
}
