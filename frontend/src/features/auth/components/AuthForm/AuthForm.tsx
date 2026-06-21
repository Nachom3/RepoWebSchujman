import { useState, type FormEvent, type ReactNode } from "react"
import { Building2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const authSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
})

export type AuthFormValues = z.infer<typeof authSchema>

export interface AuthFormProps {
  readonly eyebrow: string
  readonly title: ReactNode
  readonly subtitle?: string
  readonly submitLabel: string
  readonly loadingLabel?: string
  readonly onSubmit: (values: AuthFormValues) => Promise<void> | void
  readonly serverError?: string
  readonly footer?: ReactNode
  readonly accent?: "default" | "accent"
  readonly passwordAutoComplete?: string
}

export function AuthForm({
  eyebrow,
  title,
  subtitle,
  submitLabel,
  loadingLabel = "Procesando...",
  onSubmit,
  serverError,
  footer,
  accent = "default",
  passwordAutoComplete = "current-password",
}: Readonly<AuthFormProps>) {
  const [loading, setLoading] = useState(false)

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  })

  async function handleSubmit(values: AuthFormValues) {
    setLoading(true)
    try {
      await onSubmit(values)
    } finally {
      setLoading(false)
    }
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void form.handleSubmit(handleSubmit)(event)
  }

  const cardBg = {
    background: `
      radial-gradient(ellipse at 20% 0%, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, color-mix(in oklch, var(--accent) 10%, transparent) 0%, transparent 50%)
    `,
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background text-foreground selection:bg-primary/30"
      style={cardBg}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <Card
        surface="solid"
        padding="none"
        className="relative z-10 w-full max-w-md !rounded-2xl !p-8 sm:!p-10 shadow-xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 mb-5">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>

          {eyebrow ? (
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {eyebrow}
            </span>
          ) : null}

          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>

          {subtitle ? (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </div>

        <Form {...form}>
          <form className="space-y-5" onSubmit={onFormSubmit} noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      className="h-11 px-4 py-3 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete={passwordAutoComplete}
                      className="h-11 px-4 py-3 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError ? (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="pt-2">
              <Button
                type="submit"
                variant={accent}
                disabled={loading}
                className="w-full rounded-lg font-bold"
              >
                {loading ? loadingLabel : submitLabel}
              </Button>
            </div>
          </form>
        </Form>

        {footer ? (
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </Card>
    </main>
  )
}
