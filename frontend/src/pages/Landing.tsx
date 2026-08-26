import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "@/context/auth-context"
import {
  CTASection,
  Demo,
  Features,
  Footer,
  Hero,
  Navbar,
  Testimonials,
  UseCases,
} from "@/features/landing"

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const onNavigate = useCallback(
    (path: string) => navigate(path),
    [navigate],
  )

  return (
    <div className="landing bg-background text-foreground">
      <Navbar
        isAuthenticated={isAuthenticated}
        onNavigate={onNavigate}
        scrollTo={scrollTo}
      />
      <Hero
        isAuthenticated={isAuthenticated}
        onNavigate={onNavigate}
        scrollTo={scrollTo}
      />
      <Features />
      <UseCases />
      <Demo onNavigate={onNavigate} />
      <Testimonials />
      <CTASection
        isAuthenticated={isAuthenticated}
        onNavigate={onNavigate}
      />
      <Footer />
    </div>
  )
}
