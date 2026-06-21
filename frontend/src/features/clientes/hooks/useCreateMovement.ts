import { useState } from "react";
import { createMovement } from "../services/movementService";
import type { Movement, MovementTipo } from "../types";

export function useCreateMovement(clientId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    tipo: MovementTipo,
    monto: number,
    referencia?: string,
  ): Promise<Movement | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const movement = await createMovement(clientId, { tipo, monto, referencia });
      return movement;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create movement");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}