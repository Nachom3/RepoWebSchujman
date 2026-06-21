import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { portalLoginSchema, type PortalLoginFormData } from "../../types";
import { portalLogin } from "../../services/portalService";
import type { PortalLoginProps } from "./PortalLogin.types";

export function PortalLogin({ onLogin }: PortalLoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PortalLoginFormData>({
    resolver: zodResolver(portalLoginSchema),
  });

  async function onSubmit(data: PortalLoginFormData) {
    setError(null);
    setLoading(true);
    try {
      const session = await portalLogin(data.cuit);
      onLogin(session.sessionToken, session.client);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Portal de Autogestión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cuit">CUIT</Label>
              <Input
                id="cuit"
                placeholder="XX-XXXXXXXX-X"
                {...register("cuit")}
              />
              {errors.cuit && (
                <p className="text-sm text-destructive">{errors.cuit.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
