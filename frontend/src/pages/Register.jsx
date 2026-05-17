import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
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
      await register(form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-surface min-h-screen grid place-items-center p-6">
      <section className="auth-card w-full max-w-md rounded-3xl p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">Registro</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Crea tu cuenta</h1>
        <p className="mt-2 text-sm text-slate-600">Arranca con una experiencia segura y simple.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            Email
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500"
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
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500"
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
            className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Ya tenes cuenta?{' '}
          <Link to="/login" className="font-semibold text-amber-700 hover:text-amber-600">
            Inicia sesion
          </Link>
        </p>
      </section>
    </main>
  )
}
