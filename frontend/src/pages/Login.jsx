import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-surface min-h-screen grid place-items-center p-6">
      <section className="auth-card w-full max-w-md rounded-3xl p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-teal-700 font-semibold">Acceso</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Bienvenido de vuelta</h1>
        <p className="mt-2 text-sm text-slate-600">Inicia sesion para ingresar al dashboard.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            Email
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="block text-sm text-slate-700">
            Password
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <button
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          No tenes cuenta?{' '}
          <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-600">
            Registrate
          </Link>
        </p>
      </section>
    </main>
  )
}
