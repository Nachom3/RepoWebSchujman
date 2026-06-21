export interface FormulaFormProps {
  initialData?: { name: string; recipe?: string; pricePerCubicMeter: number };
  onSubmit: (data: { name: string; recipe?: string; pricePerCubicMeter: number }) => Promise<void>;
  isLoading?: boolean;
}
