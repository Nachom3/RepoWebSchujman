import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortalSession } from "@/features/portal/hooks/usePortalSession";
import { portalLogout } from "@/features/portal/services/portalService";
import { PortalLogin } from "@/features/portal/components/PortalLogin";

export default function PortalPage() {
  const navigate = useNavigate();
  const { isAuthenticated, client, sessionToken, login, logout } = usePortalSession();

  if (!isAuthenticated) {
    return (
      <PortalLogin
        onLogin={(token, c) => {
          login(token, c);
          navigate("/portal/orders");
        }}
      />
    );
  }

  async function handleLogout() {
    if (sessionToken) {
      await portalLogout(sessionToken);
    }
    logout();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Portal de Autogestión</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido, {client?.razonSocial}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            CUIT: {client?.cuit}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/portal/orders")}>
              Ver mis pedidos
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
