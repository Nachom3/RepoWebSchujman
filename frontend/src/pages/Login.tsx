import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { AuthForm, type AuthFormValues } from "@/features/auth"
import { useAuth } from "@/context/auth-context"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")

  async function handleSubmit({ email, password }: AuthFormValues) {
    setServerError("")
    try {
      await login(email, password)
      toast.success("Sesión iniciada")
      navigate("/dashboard")
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: string } }
      }
      const message =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        "No se pudo iniciar sesión."
      setServerError(message)
      toast.error(message)
    }
  }

  return (
    <AuthForm
      eyebrow="Bienvenido de vuelta"
      title={
        <>
          Ingresar a Obra<span className="text-primary">CTRL</span>
        </>
      }
      subtitle="Accedé a tu panel para gestionar obras y materiales."
      submitLabel="Iniciar sesión"
      loadingLabel="Ingresando..."
      onSubmit={handleSubmit}
      serverError={serverError}
      accent="default"
      passwordAutoComplete="current-password"
      footer={
        <>
          ¿No tenés cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline underline-offset-2 hover:text-primary/80 transition-all"
          >
            Registrate gratis
          </Link>
        </>
      }
    />
  )
}
