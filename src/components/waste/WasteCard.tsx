import { Progress } from "@/components/ui/progress";

interface WasteCardProps {
  city: string;
  percentage: number;
  icon: string;
}

const WasteCard = ({ city, percentage, icon }: WasteCardProps) => {
  const getColor = (value: number) => {
    if (value < 60) return "bg-green-500";
    if (value < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = (value: number) => {
    if (value < 60) return "text-green-500";
    if (value < 75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="glass-card p-6 space-y-4 hover-glow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {city}
        </h3>
        <span className={`text-2xl font-bold ${getTextColor(percentage)}`}>
          {percentage}%
        </span>
      </div>

      <div className="space-y-2">
        <Progress
          value={percentage}
          className="h-3"
          indicatorClassName={getColor(percentage)}
        />
        <p className="text-sm text-muted-foreground">
          {percentage < 60 ? "Capacity normal" : percentage < 75 ? "Collection recommended" : "Near capacity - urgent collection needed"}
        </p>
      </div>
    </div>
  );
};

export default WasteCard;
