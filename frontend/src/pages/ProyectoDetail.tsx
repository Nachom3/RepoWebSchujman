import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProjectDetailView } from "@/features/proyectos";

export default function ProyectoDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? Number.parseInt(id, 10) : null;

  if (projectId === null || Number.isNaN(projectId)) {
    return (
      <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>ID de obra inválido</AlertTitle>
          <AlertDescription>La URL no contiene un identificador de obra válido.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-6">
      <ProjectDetailView projectId={projectId} />
    </div>
  );
}
