import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

export const PeroxideCalculator = () => {
  const [volumePerm, setVolumePerm] = useState("");
  const [concPerm, setConcPerm] = useState("");
  const [volumeSample, setVolumeSample] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculatePeroxide = () => {
    const vPerm = parseFloat(volumePerm);
    const cPerm = parseFloat(concPerm);
    const vSample = parseFloat(volumeSample);
    
    if (!isNaN(vPerm) && !isNaN(cPerm) && !isNaN(vSample) && vSample > 0) {
      // H2O2 (%) = (V_perm * N_perm * 1.701) / V_amostra
      const peroxideConc = (vPerm * cPerm * 1.701) / vSample;
      setResult(peroxideConc);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-secondary" />
          Peróxido de Hidrogênio
        </CardTitle>
        <CardDescription>
          Calcule a concentração de H₂O₂ em produtos de limpeza
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="volume-perm">Volume de Permanganato (mL)</Label>
          <Input
            id="volume-perm"
            type="number"
            placeholder="0.00"
            value={volumePerm}
            onChange={(e) => setVolumePerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="conc-perm">Normalidade do Permanganato (N)</Label>
          <Input
            id="conc-perm"
            type="number"
            placeholder="0.00"
            value={concPerm}
            onChange={(e) => setConcPerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume-sample-h2o2">Volume da Amostra (mL)</Label>
          <Input
            id="volume-sample-h2o2"
            type="number"
            placeholder="0.00"
            value={volumeSample}
            onChange={(e) => setVolumeSample(e.target.value)}
          />
        </div>

        <Button onClick={calculatePeroxide} className="w-full bg-secondary hover:bg-secondary/90">
          Calcular
        </Button>

        {result !== null && (
          <div className="p-4 bg-gradient-secondary rounded-lg shadow-result">
            <p className="text-sm font-medium text-secondary-foreground mb-1">
              Concentração de H₂O₂
            </p>
            <p className="text-2xl font-bold text-secondary-foreground">
              {result.toFixed(3)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
