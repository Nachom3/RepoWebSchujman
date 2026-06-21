import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PortalTrack } from "@/features/portal/components/PortalTrack";
import { usePortalSession } from "@/features/portal/hooks/usePortalSession";
import { getPortalOrder } from "@/features/portal/services/portalService";
import type { PortalOrderDetail } from "@/features/portal/types";

export default function PortalTrackPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { sessionToken } = usePortalSession();
  const [order, setOrder] = useState<PortalOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionToken || !id) return;
    setIsLoading(true);
    setError(null);
    getPortalOrder(sessionToken, Number(id))
      .then(setOrder)
      .catch((err) => setError(err.message ?? "Pedido no encontrado"))
      .finally(() => setIsLoading(false));
  }, [sessionToken, id]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PortalTrack
        order={order}
        isLoading={isLoading}
        error={error}
        onBack={() => navigate("/portal/orders")}
      />
    </div>
  );
}
