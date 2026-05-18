import { useAuth } from '../context/auth-context'
import { Card } from '../components/molecules/Card'
import { Button } from '../components/atoms/Button'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <main className="min-h-screen p-6">
      <Card surface="night" padding="lg" className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-night-muted pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              Dashboard Privado
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Sesión iniciada correctamente
            </h1>
            <p className="mt-2 text-sm text-night-foreground/80">
              Solo usuarios autenticados pueden ver esta vista.
            </p>
          </div>
          <Button variant="nightGhost" onClick={logout}>
            Cerrar sesión
          </Button>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <Card surface="night" padding="sm" className="border-night-muted">
            <h2 className="text-sm font-semibold text-primary">Usuario</h2>
            <p className="mt-2 text-lg font-medium">{user?.email}</p>
          </Card>

          <Card surface="night" padding="sm" className="border-night-muted">
            <h2 className="text-sm font-semibold text-primary">Estado</h2>
            <p className="mt-2 text-lg font-medium">Autenticado</p>
          </Card>
        </section>
      </Card>
    </main>
  )
}
