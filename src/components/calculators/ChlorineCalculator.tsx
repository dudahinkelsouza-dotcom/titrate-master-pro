import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplet, AlertTriangle } from "lucide-react";

type ProductType = "bleach_chlorine" | "bleach_peroxide" | "disinfectant" | "antifungal" | "multipurpose";

const productSpecs = {
  bleach_chlorine: { name: "Alvejante com Cloro (NaOCl)", min: 3, max: 10, unit: "%" },
  bleach_peroxide: { name: "Alvejante sem Cloro (H₂O₂)", min: 3, max: 6, unit: "%" },
  disinfectant: { name: "Desinfetante (QACs)", min: 0.05, max: 0.2, unit: "%" },
  antifungal: { name: "Anti-mofo", min: 0.1, max: 2, unit: "%" },
  multipurpose: { name: "Multiuso (Tensoativos)", min: 2, max: 8, unit: "%" }
};

export const ChlorineCalculator = () => {
  const [productType, setProductType] = useState<ProductType>("bleach_chlorine");
  const [volumeTitrant, setVolumeTitrant] = useState("");
  const [normality, setNormality] = useState("");
  const [volumeSample, setVolumeSample] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [isOutOfRange, setIsOutOfRange] = useState(false);

  const calculateConcentration = () => {
    const vTitrant = parseFloat(volumeTitrant);
    const n = parseFloat(normality);
    const vSample = parseFloat(volumeSample);
    
    if (!isNaN(vTitrant) && !isNaN(n) && !isNaN(vSample) && vSample > 0) {
      let concentration = 0;
      
      if (productType === "bleach_chlorine") {
        // Cl (mg/L) = (Vt × N × 35.45 × 2) / Vs, depois converter para %
        const clMgL = (vTitrant * n * 35.45 * 2) / vSample;
        concentration = (clMgL / 10000); // converter mg/L para %
      } else if (productType === "bleach_peroxide") {
        // H₂O₂ (%) = (V_perm * N_perm * 1.701) / V_amostra
        concentration = (vTitrant * n * 1.701) / vSample;
      } else {
        // Para outros produtos: fórmula genérica % m/v
        concentration = (vTitrant * n * 3.545) / vSample;
      }
      
      const specs = productSpecs[productType];
      setIsOutOfRange(concentration < specs.min || concentration > specs.max);
      setResult(concentration);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          Concentração de Produtos
        </CardTitle>
        <CardDescription>
          Calcule a concentração de princípios ativos em produtos de limpeza
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product-type">Tipo de Produto</Label>
          <Select value={productType} onValueChange={(value) => setProductType(value as ProductType)}>
            <SelectTrigger id="product-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(productSpecs).map(([key, spec]) => (
                <SelectItem key={key} value={key}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume-titrant">
            Volume do Titulante (mL)
            {productType === "bleach_chlorine" && " - Tiossulfato"}
            {productType === "bleach_peroxide" && " - KMnO₄"}
          </Label>
          <Input
            id="volume-titrant"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={volumeTitrant}
            onChange={(e) => setVolumeTitrant(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="normality">Normalidade do Titulante (N)</Label>
          <Input
            id="normality"
            type="number"
            step="0.001"
            placeholder="0.000"
            value={normality}
            onChange={(e) => setNormality(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume-sample">Volume da Amostra (mL)</Label>
          <Input
            id="volume-sample"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={volumeSample}
            onChange={(e) => setVolumeSample(e.target.value)}
          />
        </div>

        <Button onClick={calculateConcentration} className="w-full">
          Calcular
        </Button>

        {result !== null && (
          <>
            <div className={`p-4 rounded-lg shadow-result ${isOutOfRange ? 'bg-destructive' : 'bg-gradient-primary'}`}>
              <p className="text-sm font-medium text-primary-foreground mb-1">
                Concentração de {productSpecs[productType].name}
              </p>
              <p className="text-2xl font-bold text-primary-foreground">
                {result.toFixed(3)}%
              </p>
              <p className="text-xs text-primary-foreground/80 mt-2">
                Faixa esperada: {productSpecs[productType].min}% - {productSpecs[productType].max}%
              </p>
            </div>
            
            {isOutOfRange && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Concentração fora do padrão!
                  </p>
                  <p className="text-xs text-destructive/80 mt-1">
                    O resultado está fora da faixa de segurança e qualidade esperada ({productSpecs[productType].min}% - {productSpecs[productType].max}%).
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
