import { useState, type FormEvent } from "react";
import { HardHat } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { portalLogin } from "../../services/portalService";
import { portalLoginSchema, type PortalLoginFormData } from "../../types";

interface PortalLoginProps {
  readonly onLogin: (token: string, client: { id: number; name: string; taxId: string | null }) => void;
}

export function PortalLogin({ onLogin }: Readonly<PortalLoginProps>) {
  const [loading, setLoading] = useState(false);

  const form = useForm<PortalLoginFormData>({
    resolver: zodResolver(portalLoginSchema),
    defaultValues: { identifier: "" },
    mode: "onBlur",
  });

  async function handleSubmit(data: PortalLoginFormData) {
    setLoading(true);
    try {
      const session = await portalLogin(data.identifier);
      toast.success("Sesión iniciada");
      onLogin(session.sessionToken, session.client);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      form.setError("root", { message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void form.handleSubmit(handleSubmit)(event);
  }

  const rootError = form.formState.errors.root?.message;

  const cardBg = {
    background: `
      radial-gradient(ellipse at 20% 0%, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, color-mix(in oklch, var(--accent) 10%, transparent) 0%, transparent 50%)
    `,
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background text-foreground selection:bg-primary/30"
      style={cardBg}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <Card
        surface="solid"
        padding="none"
        className="relative z-10 w-full max-w-md !rounded-2xl !p-8 sm:!p-10 shadow-xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 mb-5">
            <HardHat className="w-6 h-6 text-primary-foreground" />
          </div>

          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Portal del Cliente
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight">
            Accedé a tu obra
          </h1>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Ingresá tu ID o CUIT/DNI para ver el avance, las tareas y los pagos
            de tus proyectos.
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-5" onSubmit={onFormSubmit} noValidate>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID o CUIT/DNI</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="20-12345678-9"
                      autoComplete="off"
                      className="h-11 px-4 py-3 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {rootError ? (
              <Alert variant="destructive">
                <AlertDescription>{rootError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg font-bold"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </main>
  );
}
