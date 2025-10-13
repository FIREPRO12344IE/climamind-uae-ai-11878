import { Bus, Train, Clock, Users } from "lucide-react";

interface TransportCardProps {
  data: {
    city: string;
    transport_type: string;
    line_number: string;
    route_name: string;
    predicted_crowding: string;
    delay_minutes: number;
  };
}

const TransportCard = ({ data }: TransportCardProps) => {
  const getCrowdingColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getCrowdingEmoji = (level: string) => {
    switch (level) {
      case 'low': return '🟢';
      case 'moderate': return '🟡';
      case 'high': return '🔴';
      default: return '⚪';
    }
  };

  const Icon = data.transport_type === 'bus' ? Bus : Train;
  const typeEmoji = data.transport_type === 'bus' ? '🚌' : '🚇';

  return (
    <div className="glass-card p-4 space-y-3 hover-glow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-sm">{typeEmoji}</span>
          </div>
          <div>
            <h3 className="font-bold text-sm">{data.line_number}</h3>
            <p className="text-xs text-muted-foreground">{data.city}</p>
          </div>
        </div>
        <Icon className="w-4 h-4 text-primary/50" />
      </div>

      <div className="text-xs text-muted-foreground">
        {data.route_name}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <Users className="w-3 h-3" />
          <span className="text-xs">Crowding</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs">{getCrowdingEmoji(data.predicted_crowding)}</span>
          <span className={`text-xs font-semibold capitalize ${getCrowdingColor(data.predicted_crowding)}`}>
            {data.predicted_crowding}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span className="text-xs">Delay</span>
        </div>
        <span className="text-xs font-semibold">
          {data.delay_minutes === 0 ? 'On time' : `${data.delay_minutes} min`}
        </span>
      </div>
    </div>
  );
};

export default TransportCard;