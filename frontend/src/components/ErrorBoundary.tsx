import { Component, type ErrorInfo, type ReactNode } from "react"

import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  readonly children: ReactNode
  readonly fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  readonly error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info)
  }

  reset = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset)
      }
      return <DefaultErrorFallback error={this.state.error} onReset={this.reset} />
    }
    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  readonly error: Error
  readonly onReset: () => void
}

function DefaultErrorFallback({ error, onReset }: DefaultErrorFallbackProps) {
  return (
    <main className="min-h-screen grid place-items-center bg-background text-foreground p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Algo salió mal
        </h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "Ocurrió un error inesperado."}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={onReset}>Reintentar</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        </div>
      </div>
    </main>
  )
}
