import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  ClientForm,
  type CreateClientFormData,
  type UpdateClientFormData,
} from "@/features/clientes"
import { createClient } from "@/features/clientes/services/clientService"

export default function ClienteNew() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: CreateClientFormData | UpdateClientFormData) {
    setIsLoading(true)
    setError(null)

    try {
      const client = await createClient(data as CreateClientFormData)
      toast.success("Cliente creado correctamente")
      navigate(`/clientes/${client.id}`)
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: string } }
      }
      const message =
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        "No se pudo crear el cliente."

      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-screen-md space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <UserPlus className="size-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold tracking-tight">Nuevo Cliente</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Completá los datos para registrar un nuevo cliente.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/clientes">
            <ArrowLeft className="size-4" />
            Volver a clientes
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>No se pudo crear el cliente</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
