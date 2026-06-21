export interface FormulaMaterialEditorProps {
  formulaId: number;
  materials: {
    id: number;
    siloStockId: number;
    kgPerCubicMeter: number;
    siloStock: { id: number; material: string; unit: string };
  }[];
  onAdd: (siloStockId: number, kgPerCubicMeter: number) => Promise<void>;
  onRemove: (materialId: number) => Promise<void>;
  isLoading?: boolean;
}
