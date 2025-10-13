import { useEffect, useState } from "react";
import { Zap, Factory, Home, Leaf } from "lucide-react";

interface PowerCardProps {
  type: "residential" | "commercial" | "renewable";
  initialValue: number;
}

const PowerCard = ({ type, initialValue }: PowerCardProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => {
        const change = (Math.random() - 0.5) * 20;
        return Math.max(50, Math.min(1000, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const config = {
    residential: {
      icon: Home,
      title: "Residential Power",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      unit: "kWh"
    },
    commercial: {
      icon: Factory,
      title: "Commercial Power",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      unit: "kWh"
    },
    renewable: {
      icon: Leaf,
      title: "Renewable Energy",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      unit: "kWh"
    }
  };

  const { icon: Icon, title, color, bgColor, unit } = config[type];

  return (
    <div className="glass-card p-6 space-y-4 hover-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">Consumption</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums">{Math.round(value)}</span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live data</span>
        </div>
      </div>

      {type === "residential" && (
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Predicted Peak Hours: 6 PM – 10 PM ⚡
          </p>
        </div>
      )}
    </div>
  );
};

export default PowerCard;
