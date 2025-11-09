import { MassBalanceCalculator } from "@/components/calculators/MassBalanceCalculator";
import { TitrationCalculator } from "@/components/calculators/TitrationCalculator";
import { ChlorineCalculator } from "@/components/calculators/ChlorineCalculator";
import { PeroxideCalculator } from "@/components/calculators/PeroxideCalculator";
import { FlaskRound } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FlaskRound className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Calculadoras Químicas
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas para cálculos de processos químicos industriais e análises de produtos de limpeza
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <MassBalanceCalculator />
          <TitrationCalculator />
          <ChlorineCalculator />
          <PeroxideCalculator />
        </div>

        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>Sistema de Cálculos Químicos - Versão 1.0</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
