import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

type Reagent = {
  name: string;
  quantity: string;
};

type ReactionResult = {
  products: { name: string; quantity: number }[];
  byproducts: { name: string; quantity: number }[];
  waste: { name: string; quantity: number }[];
};

const reactions = {
  "neutralization": {
    name: "Produção de Sal e Água",
    reagents: ["Ácido", "Base"],
    calculate: (quantities: number[]) => {
      const [hcl, naoh] = quantities;
      const limiting = Math.min(hcl / 36.5, naoh / 40);
      return {
        products: [
          { name: "NaCl (Sal)", quantity: limiting * 58.5 },
          { name: "H₂O (Água)", quantity: limiting * 18 }
        ],
        byproducts: [],
        waste: [
          { name: "HCl em excesso", quantity: Math.max(0, hcl - limiting * 36.5) },
          { name: "NaOH em excesso", quantity: Math.max(0, naoh - limiting * 40) }
        ]
      };
    }
  },
  "chlorine_bleach": {
    name: "Produção de Água Sanitária",
    reagents: ["Cloro", "Soda Cáustica"],
    calculate: (quantities: number[]) => {
      const [cl2, naoh] = quantities;
      const limiting = Math.min(cl2 / 71, naoh / 80);
      return {
        products: [
          { name: "NaClO (Hipoclorito)", quantity: limiting * 74.5 }
        ],
        byproducts: [
          { name: "NaCl (Sal)", quantity: limiting * 58.5 },
          { name: "H₂O (Água)", quantity: limiting * 18 }
        ],
        waste: [
          { name: "Cl₂ não reagido", quantity: Math.max(0, cl2 - limiting * 71) },
          { name: "NaOH não reagido", quantity: Math.max(0, naoh - limiting * 80) }
        ]
      };
    }
  },
  "peroxide_synthesis": {
    name: "Produção de Alvejante Oxigenado",
    reagents: ["Hidrogênio", "Oxigênio"],
    calculate: (quantities: number[]) => {
      const [h2, o2] = quantities;
      const limiting = Math.min(h2 / 4, o2 / 32);
      return {
        products: [
          { name: "H₂O₂ (Peróxido)", quantity: limiting * 34 }
        ],
        byproducts: [
          { name: "H₂O (subproduto)", quantity: limiting * 18 * 0.1 }
        ],
        waste: [
          { name: "H₂ não reagido", quantity: Math.max(0, h2 - limiting * 4) },
          { name: "O₂ não reagido", quantity: Math.max(0, o2 - limiting * 32) }
        ]
      };
    }
  }
};

export const MassBalanceCalculator = () => {
  const [selectedReaction, setSelectedReaction] = useState<keyof typeof reactions>("neutralization");
  const [reagents, setReagents] = useState<Reagent[]>([
    { name: "", quantity: "" },
    { name: "", quantity: "" }
  ]);
  const [result, setResult] = useState<ReactionResult | null>(null);
  const [unit, setUnit] = useState<"kg" | "L" | "mL">("kg");

  const calculateBalance = () => {
    const reaction = reactions[selectedReaction];
    const quantities = reagents.map(r => parseFloat(r.quantity) || 0);
    
    if (quantities.some(q => q <= 0)) return;
    
    const calculated = reaction.calculate(quantities);
    setResult(calculated);
  };

  const handleReactionChange = (value: keyof typeof reactions) => {
    setSelectedReaction(value);
    setReagents([
      { name: reactions[value].reagents[0], quantity: "" },
      { name: reactions[value].reagents[1], quantity: "" }
    ]);
    setResult(null);
  };

  const convertUnit = (valueKg: number) => {
    if (unit === "L") {
      return valueKg; // Assumindo densidade ≈ 1 kg/L (água)
    } else if (unit === "mL") {
      return valueKg * 1000; // kg → L → mL
    }
    return valueKg; // kg
  };

  const getUnitLabel = () => {
    return unit;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Balanço de Massa
        </CardTitle>
        <CardDescription>
          Calcule produtos, subprodutos e descartes em reações químicas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reaction">Tipo de Reação</Label>
            <Select value={selectedReaction} onValueChange={handleReactionChange}>
              <SelectTrigger id="reaction">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(reactions).map(([key, reaction]) => (
                  <SelectItem key={key} value={key}>
                    {reaction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unidade de Resultado</Label>
            <Select value={unit} onValueChange={(value: "kg" | "L" | "mL") => setUnit(value)}>
              <SelectTrigger id="unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                <SelectItem value="L">Litros (L)</SelectItem>
                <SelectItem value="mL">Mililitros (mL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {reagents.map((reagent, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`reagent-${index}`}>
              {reactions[selectedReaction].reagents[index]} (kg)
            </Label>
            <Input
              id={`reagent-${index}`}
              type="number"
              placeholder="0.00"
              value={reagent.quantity}
              onChange={(e) => {
                const newReagents = [...reagents];
                newReagents[index].quantity = e.target.value;
                setReagents(newReagents);
              }}
            />
          </div>
        ))}

        <Button onClick={calculateBalance} className="w-full">
          Calcular Reação
        </Button>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-primary rounded-lg shadow-result">
              <p className="text-sm font-medium text-primary-foreground mb-2">
                Produtos Principais
              </p>
              {result.products.map((product, i) => (
                <p key={i} className="text-lg font-bold text-primary-foreground">
                  {product.name}: {convertUnit(product.quantity).toFixed(3)} {getUnitLabel()}
                </p>
              ))}
            </div>

            {result.byproducts.length > 0 && (
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm font-medium text-secondary-foreground mb-2">
                  Subprodutos
                </p>
                {result.byproducts.map((byproduct, i) => (
                  <p key={i} className="text-base text-secondary-foreground">
                    {byproduct.name}: {convertUnit(byproduct.quantity).toFixed(3)} {getUnitLabel()}
                  </p>
                ))}
              </div>
            )}

            {result.waste.some(w => w.quantity > 0) && (
              <div className="p-4 bg-destructive/20 rounded-lg border border-destructive/30">
                <p className="text-sm font-medium text-destructive mb-2">
                  Descartes / Excesso
                </p>
                {result.waste.filter(w => w.quantity > 0).map((waste, i) => (
                  <p key={i} className="text-base text-destructive">
                    {waste.name}: {convertUnit(waste.quantity).toFixed(3)} {getUnitLabel()}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
