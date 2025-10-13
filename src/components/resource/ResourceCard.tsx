import { Zap, Droplet } from "lucide-react";

interface ResourceCardProps {
  data: {
    city: string;
    electricity_usage: number;
    water_usage: number;
  };
}

const ResourceCard = ({ data }: ResourceCardProps) => {
  const getUsageStatus = (value: number, type: 'electricity' | 'water') => {
    const threshold = type === 'electricity' ? 500 : 300;
    if (value < threshold * 0.5) return { label: "Low", color: "text-green-400" };
    if (value < threshold * 0.8) return { label: "Moderate", color: "text-yellow-400" };
    return { label: "High", color: "text-red-400" };
  };

  const electricityStatus = getUsageStatus(data.electricity_usage, 'electricity');
  const waterStatus = getUsageStatus(data.water_usage, 'water');

  return (
    <div className="glass-card p-6 space-y-4 hover-glow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{data.city}</h3>
          <p className="text-sm text-muted-foreground mt-1">Resource Usage</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-lg">⚡</span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Electricity</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{data.electricity_usage} MW</p>
            <p className={`text-xs font-semibold ${electricityStatus.color}`}>
              {electricityStatus.label}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-muted-foreground">Water</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{data.water_usage} MG</p>
            <p className={`text-xs font-semibold ${waterStatus.color}`}>
              {waterStatus.label}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          💡 {electricityStatus.label === "High" ? "Consider reducing AC usage during peak hours" : "Usage within normal range"}
        </p>
      </div>
    </div>
  );
};

export default ResourceCard;