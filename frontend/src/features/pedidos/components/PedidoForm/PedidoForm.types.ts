export interface PedidoFormProps {
  onSubmit: (data: { clientId: number; formulaId: number; quantity: number; deliveryDate?: string }) => Promise<void>;
  isLoading?: boolean;
}
