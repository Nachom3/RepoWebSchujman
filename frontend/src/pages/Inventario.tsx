import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormulaList } from "@/features/inventario";
import { SiloList } from "@/features/inventario";

export default function Inventario() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventario</h1>
      <Tabs defaultValue="formulas">
        <TabsList>
          <TabsTrigger value="formulas">Fórmulas</TabsTrigger>
          <TabsTrigger value="silos">Silos</TabsTrigger>
        </TabsList>
        <TabsContent value="formulas">
          <FormulaList />
        </TabsContent>
        <TabsContent value="silos">
          <SiloList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
