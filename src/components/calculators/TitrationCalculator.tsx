import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";

export const TitrationCalculator = () => {
  const [volumeTitrant, setVolumeTitrant] = useState("");
  const [concentrationTitrant, setConcentrationTitrant] = useState("");
  const [volumeSample, setVolumeSample] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateTitration = () => {
    const vTitrant = parseFloat(volumeTitrant);
    const cTitrant = parseFloat(concentrationTitrant);
    const vSample = parseFloat(volumeSample);
    
    if (!isNaN(vTitrant) && !isNaN(cTitrant) && !isNaN(vSample) && vSample > 0) {
      // C1*V1 = C2*V2
      const concentration = (vTitrant * cTitrant) / vSample;
      setResult(concentration);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="h-5 w-5 text-secondary" />
          Cálculo de Titulação
        </CardTitle>
        <CardDescription>
          Determine a concentração da amostra por titulação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="volume-titrant">Volume do Titulante (mL)</Label>
          <Input
            id="volume-titrant"
            type="number"
            placeholder="0.00"
            value={volumeTitrant}
            onChange={(e) => setVolumeTitrant(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="conc-titrant">Concentração do Titulante (mol/L)</Label>
          <Input
            id="conc-titrant"
            type="number"
            placeholder="0.00"
            value={concentrationTitrant}
            onChange={(e) => setConcentrationTitrant(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume-sample">Volume da Amostra (mL)</Label>
          <Input
            id="volume-sample"
            type="number"
            placeholder="0.00"
            value={volumeSample}
            onChange={(e) => setVolumeSample(e.target.value)}
          />
        </div>

        <Button onClick={calculateTitration} className="w-full bg-secondary hover:bg-secondary/90">
          Calcular
        </Button>

        {result !== null && (
          <div className="p-4 bg-gradient-secondary rounded-lg shadow-result">
            <p className="text-sm font-medium text-secondary-foreground mb-1">
              Concentração da Amostra
            </p>
            <p className="text-2xl font-bold text-secondary-foreground">
              {result.toFixed(4)} mol/L
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
