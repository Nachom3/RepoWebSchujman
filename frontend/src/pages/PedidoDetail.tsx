import { useParams } from "react-router-dom";
import { PedidoDetail } from "@/features/pedidos";

export default function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id ?? "", 10);
  if (isNaN(orderId)) {
    return <div className="p-4">ID de pedido inválido.</div>;
  }
  return <PedidoDetail orderId={orderId} />;
}
