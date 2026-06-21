import { useNavigate } from "react-router-dom";
import { PortalOrders } from "@/features/portal/components/PortalOrders";
import { usePortalSession } from "@/features/portal/hooks/usePortalSession";
import { usePortalOrders } from "@/features/portal/hooks/usePortalOrders";
import { portalLogout } from "@/features/portal/services/portalService";

export default function PortalOrdersPage() {
  const navigate = useNavigate();
  const { sessionToken, logout } = usePortalSession();
  const { data: orders, isLoading, error } = usePortalOrders(sessionToken);

  async function handleLogout() {
    if (sessionToken) {
      await portalLogout(sessionToken);
    }
    logout();
    navigate("/portal/login");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PortalOrders
        orders={orders}
        isLoading={isLoading}
        error={error}
        onTrack={(id) => navigate(`/portal/orders/${id}`)}
        onNewOrder={() => navigate("/portal/orders/new")}
        onLogout={handleLogout}
      />
    </div>
  );
}
