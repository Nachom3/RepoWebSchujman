import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/context/AuthContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"

import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <TooltipProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </ErrorBoundary>
  </StrictMode>,
)
