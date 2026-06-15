import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { Navbar } from '../components/organisms/Navbar'
import { Hero } from '../components/organisms/Hero'
import { Features } from '../components/organisms/Features'
import { UseCases } from '../components/organisms/UseCases'
import { Demo } from '../components/organisms/Demo'
import { Testimonials } from '../components/organisms/Testimonials'
import { CTASection } from '../components/organisms/CTASection'
import { Footer } from '../components/organisms/Footer'

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const onNavigate = useCallback(
    (path: string) => navigate(path),
    [navigate],
  )

  return (
    <div className="landing bg-surface text-surface-foreground">
      <Navbar isAuthenticated={isAuthenticated} onNavigate={onNavigate} scrollTo={scrollTo} />
      <Hero isAuthenticated={isAuthenticated} onNavigate={onNavigate} scrollTo={scrollTo} />
      <Features />
      <UseCases />
      <Demo onNavigate={onNavigate} />
      <Testimonials />
      <CTASection isAuthenticated={isAuthenticated} onNavigate={onNavigate} />
      <Footer />
    </div>
  )
}
