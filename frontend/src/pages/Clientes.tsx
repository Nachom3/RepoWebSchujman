import { Users } from "lucide-react";
import { ClientList } from "@/features/clientes";

export default function Clientes() {
  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
      </div>
      <ClientList />
    </div>
  );
}
