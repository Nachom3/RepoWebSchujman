import { useParams } from "react-router-dom";
import { ClientDetail } from "@/features/clientes";

export default function ClienteDetail() {
  const { id } = useParams<{ id: string }>();
  const clientId = parseInt(id ?? "", 10);
  if (isNaN(clientId)) {
    return <div className="p-4">ID de cliente inválido.</div>;
  }
  return <ClientDetail clientId={clientId} />;
}