import { useEffect, useState } from "react";
import WasteCard from "./WasteCard";

interface WasteData {
  city: string;
  percentage: number;
  icon: string;
}

const WasteModule = () => {
  const [wasteData, setWasteData] = useState<WasteData[]>([
    { city: "Dubai", percentage: 68, icon: "♻️" },
    { city: "Sharjah", percentage: 52, icon: "🗑️" },
    { city: "Abu Dhabi", percentage: 80, icon: "🚮" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWasteData(prev => prev.map(item => ({
        ...item,
        percentage: Math.max(40, Math.min(90, item.percentage + (Math.random() - 0.5) * 3))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const highestFillage = Math.max(...wasteData.map(d => d.percentage));
  const daysToFull = Math.ceil((100 - highestFillage) / 10);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 border-l-4 border-accent hover-glow bg-gradient-to-r from-accent/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-accent text-lg">AI Smart Collection Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Predicted full capacity in <span className="font-bold text-accent">{daysToFull} days</span> — smart collection suggested.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Our AI system continuously monitors waste levels across UAE cities and optimizes collection routes to prevent overflow.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Waste Management Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wasteData.map((data) => (
            <WasteCard key={data.city} {...data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WasteModule;
