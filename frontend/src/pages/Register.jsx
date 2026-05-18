import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { AuthForm } from '../components/organisms/AuthForm'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit({ email, password }) {
    setError('')
    setLoading(true)
    try {
      await register(email, password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
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
      error={error}
      loading={loading}
      accent="accent"
      passwordAutoComplete="new-password"
      footer={
        <>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-semibold text-accent-foreground hover:text-accent-hover">
            Iniciá sesión
          </Link>
        </>
      }
    />
  )
}
