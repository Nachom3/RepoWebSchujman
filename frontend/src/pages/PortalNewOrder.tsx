import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PortalNewOrder } from "@/features/portal/components/PortalNewOrder";
import { usePortalSession } from "@/features/portal/hooks/usePortalSession";
import { createPortalOrder } from "@/features/portal/services/portalService";
import type { PortalCreateOrderFormData } from "@/features/portal/types";

export default function PortalNewOrderPage() {
  const navigate = useNavigate();
  const { sessionToken } = usePortalSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: PortalCreateOrderFormData) {
    if (!sessionToken) return;
    setIsLoading(true);
    setError(null);
    try {
      await createPortalOrder(sessionToken, data);
      navigate("/portal/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear pedido");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PortalNewOrder
        onSubmit={handleSubmit}
        onCancel={() => navigate("/portal/orders")}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
