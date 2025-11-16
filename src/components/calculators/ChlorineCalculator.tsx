import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplet, AlertTriangle } from "lucide-react";

type ProductType = "bleach_chlorine" | "bleach_peroxide" | "disinfectant" | "antifungal" | "multipurpose";

const productSpecs = {
  bleach_chlorine: { name: "Água Sanitária", min: 3, max: 10, unit: "%" },
  bleach_peroxide: { name: "Alvejante Sem Cloro", min: 3, max: 6, unit: "%" },
  disinfectant: { name: "Desinfetante Perfumado", min: 0.05, max: 0.2, unit: "%" },
  antifungal: { name: "Removedor de Mofo", min: 0.1, max: 2, unit: "%" },
  multipurpose: { name: "Limpador Multiuso", min: 2, max: 8, unit: "%" }
};

export const ChlorineCalculator = () => {
  const [productType, setProductType] = useState<ProductType>("bleach_chlorine");
  const [volumeTitrant, setVolumeTitrant] = useState("");
  const [normality, setNormality] = useState("");
  const [volumeSample, setVolumeSample] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [suggestedVolume, setSuggestedVolume] = useState<number | null>(null);

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
      const outOfRange = concentration < specs.min || concentration > specs.max;
      setIsOutOfRange(outOfRange);
      setResult(concentration);
      
      // Se fora do padrão, calcular volume sugerido para atingir o meio do range
      if (outOfRange) {
        const targetConcentration = (specs.min + specs.max) / 2;
        let suggestedVol = 0;
        
        if (productType === "bleach_chlorine") {
          // targetConcentration = (V * n * 35.45 * 2) / vSample / 10000
          suggestedVol = (targetConcentration * 10000 * vSample) / (n * 35.45 * 2);
        } else if (productType === "bleach_peroxide") {
          // targetConcentration = (V * n * 1.701) / vSample
          suggestedVol = (targetConcentration * vSample) / (n * 1.701);
        } else {
          // targetConcentration = (V * n * 3.545) / vSample
          suggestedVol = (targetConcentration * vSample) / (n * 3.545);
        }
        
        setSuggestedVolume(suggestedVol);
      } else {
        setSuggestedVolume(null);
      }
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
          <div className="space-y-3">
            <div className="p-4 bg-gradient-primary rounded-lg shadow-result">
              <p className="text-sm font-medium text-primary-foreground mb-2">
                Concentração Calculada
              </p>
              <p className="text-2xl font-bold text-primary-foreground">
                {result.toFixed(2)} {productSpecs[productType].unit}
              </p>
              <p className="text-xs text-primary-foreground/80 mt-1">
                Padrão esperado: {productSpecs[productType].min} - {productSpecs[productType].max} {productSpecs[productType].unit}
              </p>
            </div>

            {isOutOfRange && (
              <>
                <div className="p-4 bg-destructive/20 rounded-lg border border-destructive/30 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      Atenção: Concentração Fora do Padrão
                    </p>
                    <p className="text-xs text-destructive/80 mt-1">
                      O valor está {result < productSpecs[productType].min ? "abaixo" : "acima"} do esperado para {productSpecs[productType].name}.
                    </p>
                  </div>
                </div>

                {suggestedVolume !== null && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                    <p className="text-sm font-medium text-primary mb-2">
                      💡 Sugestão de Ajuste
                    </p>
                    <p className="text-sm text-foreground mb-2">
                      Para atingir uma concentração ideal de {((productSpecs[productType].min + productSpecs[productType].max) / 2).toFixed(2)}{productSpecs[productType].unit}, use:
                    </p>
                    <p className="text-base font-semibold text-primary">
                      Volume do Titulante: {suggestedVolume.toFixed(2)} mL
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
