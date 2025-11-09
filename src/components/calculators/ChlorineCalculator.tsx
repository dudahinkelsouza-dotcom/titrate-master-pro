import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";

export const ChlorineCalculator = () => {
  const [volumeThio, setVolumeThio] = useState("");
  const [concThio, setConcThio] = useState("");
  const [volumeSample, setVolumeSample] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateChlorine = () => {
    const vThio = parseFloat(volumeThio);
    const cThio = parseFloat(concThio);
    const vSample = parseFloat(volumeSample);
    
    if (!isNaN(vThio) && !isNaN(cThio) && !isNaN(vSample) && vSample > 0) {
      // Cloro ativo (%) = (V_thio * N_thio * 3.545) / V_amostra
      const chlorineActive = (vThio * cThio * 3.545) / vSample;
      setResult(chlorineActive);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          Cloro Ativo
        </CardTitle>
        <CardDescription>
          Calcule a concentração de cloro ativo em produtos de limpeza
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="volume-thio">Volume de Tiossulfato (mL)</Label>
          <Input
            id="volume-thio"
            type="number"
            placeholder="0.00"
            value={volumeThio}
            onChange={(e) => setVolumeThio(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="conc-thio">Normalidade do Tiossulfato (N)</Label>
          <Input
            id="conc-thio"
            type="number"
            placeholder="0.00"
            value={concThio}
            onChange={(e) => setConcThio(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume-sample-cl">Volume da Amostra (mL)</Label>
          <Input
            id="volume-sample-cl"
            type="number"
            placeholder="0.00"
            value={volumeSample}
            onChange={(e) => setVolumeSample(e.target.value)}
          />
        </div>

        <Button onClick={calculateChlorine} className="w-full">
          Calcular
        </Button>

        {result !== null && (
          <div className="p-4 bg-gradient-primary rounded-lg shadow-result">
            <p className="text-sm font-medium text-primary-foreground mb-1">
              Concentração de Cloro Ativo
            </p>
            <p className="text-2xl font-bold text-primary-foreground">
              {result.toFixed(3)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
