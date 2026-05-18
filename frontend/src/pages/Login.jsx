import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { AuthForm } from '../components/organisms/AuthForm'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit({ email, password }) {
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      eyebrow="Acceso"
      title="Bienvenido de vuelta"
      subtitle="Iniciá sesión para ingresar al dashboard."
      submitLabel="Iniciar sesión"
      loadingLabel="Ingresando..."
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      accent="primary"
      passwordAutoComplete="current-password"
      footer={
        <>
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
            Registrate
          </Link>
        </>
      }
    />
  )
}
