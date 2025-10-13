import { Cloud, Droplets, Wind, Eye, Sun, CloudRain } from "lucide-react";

interface WeatherCardProps {
  data: {
    city: string;
    temperature: number;
    humidity: number;
    windspeed: number;
    air_quality: number;
    uv_index: number;
    rainfall: number;
  };
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const getAirQualityStatus = (value: number) => {
    if (value < 50) return { label: "Good", color: "text-green-400" };
    if (value < 100) return { label: "Moderate", color: "text-yellow-400" };
    return { label: "Poor", color: "text-red-400" };
  };

  const airQuality = getAirQualityStatus(data.air_quality);

  return (
    <div className="glass-card p-6 space-y-4 hover-glow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{data.city}</h3>
          <p className="text-3xl font-bold text-primary mt-2">{data.temperature}°C</p>
        </div>
        <Cloud className="w-12 h-12 text-primary/50" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-semibold">{data.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="text-sm font-semibold">{data.windspeed} km/h</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-xs text-muted-foreground">Air Quality</p>
            <p className={`text-sm font-semibold ${airQuality.color}`}>{airQuality.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-xs text-muted-foreground">UV Index</p>
            <p className="text-sm font-semibold">{data.uv_index}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 col-span-2">
          <CloudRain className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-muted-foreground">Rainfall</p>
            <p className="text-sm font-semibold">{data.rainfall} mm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
