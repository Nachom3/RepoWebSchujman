import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-background text-foreground p-6">
      <div className="max-w-md text-center space-y-4">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider">
          Error 404
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Página no encontrada
        </h1>
        <p className="text-sm text-muted-foreground">
          La ruta que buscás no existe o fue movida.
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
