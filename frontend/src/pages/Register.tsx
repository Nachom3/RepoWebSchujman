import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { AuthForm, type AuthFormValues } from "@/features/auth"
import { useAuth } from "@/context/auth-context"

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")

  async function handleSubmit({ email, password }: AuthFormValues) {
    setServerError("")
    try {
      await register(email, password)
      toast.success("Cuenta creada. Iniciá sesión.")
      navigate("/login")
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      const message =
        axiosErr.response?.data?.error || "No se pudo crear la cuenta."
      setServerError(message)
      toast.error(message)
    }
  }

  return (
    <AuthForm
      eyebrow="Registro"
      title="Creá tu cuenta"
      subtitle="Empezá con una experiencia segura y simple."
      submitLabel="Crear cuenta"
      loadingLabel="Creando cuenta..."
      onSubmit={handleSubmit}
      serverError={serverError}
      accent="accent"
      passwordAutoComplete="new-password"
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-accent-foreground hover:text-accent"
          >
            Iniciá sesión
          </Link>
        </>
      }
    />
  )
}
