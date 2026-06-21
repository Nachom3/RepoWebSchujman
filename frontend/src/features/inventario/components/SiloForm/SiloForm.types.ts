export interface SiloFormProps {
  initialData?: { material: string; quantity: number; unit: string; alertMin: number };
  onSubmit: (data: { material: string; quantity: number; unit: string; alertMin: number }) => Promise<void>;
  isLoading?: boolean;
}
