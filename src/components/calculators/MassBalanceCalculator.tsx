import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export const MassBalanceCalculator = () => {
  const [massIn, setMassIn] = useState("");
  const [massOut, setMassOut] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateBalance = () => {
    const inlet = parseFloat(massIn);
    const outlet = parseFloat(massOut);
    
    if (!isNaN(inlet) && !isNaN(outlet)) {
      setResult(inlet - outlet);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Balanço de Massa
        </CardTitle>
        <CardDescription>
          Calcule o balanço de massa em processos químicos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mass-in">Massa de Entrada (kg)</Label>
          <Input
            id="mass-in"
            type="number"
            placeholder="0.00"
            value={massIn}
            onChange={(e) => setMassIn(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mass-out">Massa de Saída (kg)</Label>
          <Input
            id="mass-out"
            type="number"
            placeholder="0.00"
            value={massOut}
            onChange={(e) => setMassOut(e.target.value)}
          />
        </div>

        <Button onClick={calculateBalance} className="w-full">
          Calcular
        </Button>

        {result !== null && (
          <div className="p-4 bg-gradient-primary rounded-lg shadow-result">
            <p className="text-sm font-medium text-primary-foreground mb-1">
              Diferença de Massa
            </p>
            <p className="text-2xl font-bold text-primary-foreground">
              {result.toFixed(3)} kg
            </p>
            <p className="text-xs text-primary-foreground/80 mt-1">
              {result > 0 ? "Acúmulo no sistema" : result < 0 ? "Perda do sistema" : "Sistema em equilíbrio"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
