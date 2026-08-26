import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClientDetail } from "@/features/clientes";

export default function ClienteDetail() {
  const { id } = useParams<{ id: string }>();
  const clientId = parseInt(id ?? "", 10);

  if (isNaN(clientId)) {
    return (
      <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>ID de cliente inválido</AlertTitle>
          <AlertDescription>La URL no contiene un identificador de cliente válido.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-8">
      <ClientDetail clientId={clientId} />
    </div>
  );
}
