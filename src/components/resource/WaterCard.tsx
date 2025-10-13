import { useEffect, useState } from "react";
import { Droplet } from "lucide-react";

const WaterCard = () => {
  const [percentage, setPercentage] = useState(75);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(prev => Math.max(60, Math.min(85, prev + (Math.random() - 0.5) * 5)));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-6 space-y-6 hover-glow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Droplet className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold">Water Usage</h3>
          <p className="text-xs text-muted-foreground">Daily consumption</p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-blue-400 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{Math.round(percentage)}%</span>
            <span className="text-sm text-muted-foreground">of target</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-border/50">
        <div className="flex items-start gap-2">
          <span className="text-lg">💧</span>
          <div>
            <p className="text-sm font-medium">Sharjah Conservation Update</p>
            <p className="text-xs text-muted-foreground">
              Water waste reduced by 12% this week. Stay hydrated, not wasteful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterCard;
