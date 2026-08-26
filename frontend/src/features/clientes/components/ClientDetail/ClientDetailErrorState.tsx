import { AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ClientDetailErrorStateProps {
  title: string;
  description: string;
  onBack: () => void;
}

export function ClientDetailErrorState({ title, description, onBack }: ClientDetailErrorStateProps) {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>

      <div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Volver a clientes
        </Button>
      </div>
    </div>
  );
}
