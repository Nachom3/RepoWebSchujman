export interface TruckFormProps {
  initialData?: { patente: string; capacity: number };
  onSubmit: (data: { patente: string; capacity: number }) => Promise<void>;
  isLoading?: boolean;
}
