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

  const getCityHotspots = () => {
    const hotspots: { [key: string]: string[] } = {
      'Dubai': ['Sheikh Zayed Road (E11)', 'Emirates Road (E611)', 'Business Bay', 'Al Khail Road'],
      'Abu Dhabi': ['Sheikh Zayed Grand Mosque corridor', 'Sheikh Zayed Road', 'Salam Street', 'Sheikh Khalifa/Al Falah'],
      'Sharjah': ['Al Ittihad Road', 'Airport Road', 'Al Nahda areas (Dubai commute)'],
      'Ajman': ['Corniche road', 'E11 approaches', 'Abu Dhabi/Dubai-bound feeders'],
      'Umm Al Quwain': ['Main connectors to Ajman/Dubai', 'Coastal roads'],
      'Ras Al Khaimah': ['City center approaches', 'Industrial roads'],
      'Fujairah': ['Coastal highway', 'City approaches', 'Mountain-road sections']
    };
    return hotspots[data.city] || ['Check local traffic sources'];
  };

  const getMorningJamInfo = () => {
    const morningJams: { [key: string]: string } = {
      'Dubai': 'Heavy inbound towards Dubai Marina/Downtown 07:30–09:00',
      'Abu Dhabi': 'Inbound to Abu Dhabi island 07:00–09:00',
      'Sharjah': 'Lots of through-traffic from Sharjah → Dubai 07:15–09:00',
      'Ajman': 'Peak commute time towards Dubai',
      'Umm Al Quwain': 'Slowdowns on main connectors during peak commute',
      'Ras Al Khaimah': 'City center approaches slow during morning rush',
      'Fujairah': 'Coastal highway approaches can be slow'
    };
    return morningJams[data.city] || 'Peak hours: 7-9 AM';
  };

  const getTrafficSources = () => {
    const sources: { [key: string]: string[] } = {
      'Dubai': ['RTA traffic services & cameras', 'TomTom traffic index', 'Google Maps/Waze'],
      'Abu Dhabi': ['Abu Dhabi Police updates', 'Traffic cams', 'TomTom'],
      'Sharjah': ['TomTom', 'Sharjah police cams'],
      'Ajman': ['Ajman Police app'],
      'Umm Al Quwain': ['Waze', 'ViaMichelin'],
      'Ras Al Khaimah': ['AI traffic cameras', 'Official feeds'],
      'Fujairah': ['SkylineWebcams', 'ViaMichelin']
    };
    return sources[data.city] || ['Local traffic sources'];
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
              <p className="text-xs font-semibold text-primary flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Traffic Hotspots
              </p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                {getCityHotspots().map((hotspot, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    {hotspot}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Morning Rush Hour
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {getMorningJamInfo()}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Live Traffic Sources
              </p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                {getTrafficSources().map((source, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    {source}
                  </li>
                ))}
              </ul>
            </div>

            {data.alert_status === 'heavy' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-400">⚠️ Heavy Traffic Alert</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use live sources above for real-time reroutes and avoid peak hours when possible.
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
