import { Car, Clock, AlertTriangle, ChevronDown, ChevronUp, TrendingUp, MapPin } from "lucide-react";
import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'smooth': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '🟢' };
      case 'moderate': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🟡' };
      case 'heavy': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '🔴' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', icon: '⚪' };
    }
  };

  const statusStyle = getStatusColor(data.alert_status);

  const getTravelTimeAdvice = () => {
    if (data.alert_status === 'heavy') return '🔴 Expect significant delays - consider metro or alternative routes';
    if (data.alert_status === 'moderate') return '🟡 Moderate traffic - allow extra time for your journey';
    return '✅ Good conditions for driving';
  };

  const getAlternativeRoutes = () => {
    if (data.city === 'Dubai' && data.alert_status === 'heavy') {
      return ['Metro Red Line', 'Alternative: Al Khail Road', 'Alternative: Umm Suqeim Road'];
    }
    return ['Metro available', 'Check Dubai Drive app for real-time alternatives'];
  };

  return (
    <div 
      className="glass-card p-6 space-y-4 hover-glow cursor-pointer transition-all duration-300"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{data.city}</h3>
          {data.route_name && (
            <p className="text-sm text-muted-foreground mt-1">{data.route_name}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Car className="w-12 h-12 text-primary/50" />
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
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

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-3 p-4 bg-background/50 rounded-lg">
            <div>
              <p className="text-xs font-semibold text-primary">Travel Time Advice</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getTravelTimeAdvice()}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">Alternative Routes</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                {getAlternativeRoutes().map((route, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {route}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">Peak Hours to Avoid</p>
              <p className="text-xs text-muted-foreground mt-1">
                🕐 Morning: 7-9 AM (24% congestion) | Evening: 5-7 PM (up to 60% congestion)
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">Traffic Stats (2024)</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-orange-400" />
                  <span className="text-xs">Avg: 18min per 10km</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs">Rush: 23min per 10km</span>
                </div>
              </div>
            </div>

            {data.alert_status === 'heavy' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-400">⚠️ Heavy Traffic Alert</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Consider using public transport. Dubai Metro is faster during peak hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficCard;
