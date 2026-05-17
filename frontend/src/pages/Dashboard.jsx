import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Dashboard Privado</p>
            <h1 className="mt-2 text-3xl font-black">Sesion iniciada correctamente</h1>
            <p className="mt-2 text-sm text-slate-300">Solo usuarios autenticados pueden ver esta vista.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:border-cyan-300 hover:text-cyan-300"
          >
            Cerrar sesion
          </button>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h2 className="text-sm font-semibold text-cyan-300">Usuario</h2>
            <p className="mt-2 text-lg font-medium">{user?.email}</p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h2 className="text-sm font-semibold text-cyan-300">Estado</h2>
            <p className="mt-2 text-lg font-medium">Autenticado</p>
          </article>
        </section>
      </div>
    </main>
  )
}
