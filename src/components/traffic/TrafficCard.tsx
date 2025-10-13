import { Car, Clock, AlertTriangle } from "lucide-react";

interface TrafficCardProps {
  data: {
    city: string;
    congestion_level: string;
    avg_speed: number;
    alert_status: string;
    route_name: string | null;
    delay_minutes: number | null;
  };
}

const TrafficCard = ({ data }: TrafficCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'smooth': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '🟢' };
      case 'moderate': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🟡' };
      case 'heavy': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '🔴' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', icon: '⚪' };
    }
  };

  const statusStyle = getStatusColor(data.alert_status);

  return (
    <div className="glass-card p-6 space-y-4 hover-glow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{data.city}</h3>
          {data.route_name && (
            <p className="text-sm text-muted-foreground mt-1">{data.route_name}</p>
          )}
        </div>
        <Car className="w-12 h-12 text-primary/50" />
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusStyle.bg} border ${statusStyle.border}`}>
        <span className="text-lg">{statusStyle.icon}</span>
        <span className={`font-semibold ${statusStyle.text}`}>
          {data.alert_status.charAt(0).toUpperCase() + data.alert_status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-xs text-muted-foreground">Avg Speed</p>
            <p className="text-sm font-semibold">{data.avg_speed} km/h</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-xs text-muted-foreground">Congestion</p>
            <p className="text-sm font-semibold">{data.congestion_level}</p>
          </div>
        </div>

        {data.delay_minutes !== null && (
          <div className="flex items-center gap-2 col-span-2">
            <Clock className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Delay</p>
              <p className="text-sm font-semibold">{data.delay_minutes} minutes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficCard;
