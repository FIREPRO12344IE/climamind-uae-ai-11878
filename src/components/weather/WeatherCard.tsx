import { Cloud, Droplets, Wind, Eye, Sun, CloudRain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface WeatherCardProps {
  data: {
    city: string;
    temperature: number;
    humidity: number;
    windspeed: number;
    air_quality: number;
    uv_index: number;
    rainfall: number;
    visibility?: number;
  };
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAirQualityStatus = (value: number) => {
    if (value < 50) return { label: "Good", color: "text-green-400", description: "Excellent conditions" };
    if (value < 100) return { label: "Moderate", color: "text-yellow-400", description: "Acceptable conditions" };
    return { label: "Poor", color: "text-red-400", description: "Health concerns possible" };
  };

  const getUVStatus = (value: number) => {
    if (value < 3) return { label: "Low", color: "text-green-400" };
    if (value < 6) return { label: "Moderate", color: "text-yellow-400" };
    if (value < 8) return { label: "High", color: "text-orange-400" };
    return { label: "Very High", color: "text-red-400" };
  };

  const getHumidityStatus = (value: number) => {
    if (value > 85) return "Very humid - Rain gear may be needed";
    if (value > 70) return "High humidity - Feels warmer than actual temperature";
    if (value > 50) return "Comfortable humidity levels";
    return "Low humidity - Stay hydrated";
  };

  const airQuality = getAirQualityStatus(data.air_quality);
  const uvStatus = getUVStatus(data.uv_index);

  return (
    <div 
      className="glass-card p-6 space-y-4 hover-glow cursor-pointer transition-all duration-300"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{data.city}</h3>
          <p className="text-3xl font-bold text-primary mt-2">{Math.round(data.temperature)}°C</p>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="w-12 h-12 text-primary/50" />
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
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
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Rainfall</p>
                <p className="text-sm font-semibold">{data.rainfall} mm</p>
              </div>
            </div>

            {data.visibility != null && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Visibility</p>
                  <p className="text-sm font-semibold">{data.visibility.toFixed(1)} km</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 p-4 bg-background/50 rounded-lg">
            <div>
              <p className="text-xs font-semibold text-primary">Air Quality Details</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.air_quality.toFixed(0)} AQI - {airQuality.description}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">UV Index Status</p>
              <p className={`text-xs mt-1 ${uvStatus.color}`}>
                {uvStatus.label} - {data.uv_index < 6 ? "Sunscreen recommended" : "Strong sun protection required"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">Humidity Analysis</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getHumidityStatus(data.humidity)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">Activity Recommendations</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.temperature > 38 ? "⚠️ Too hot for outdoor activities" :
                 data.temperature > 35 ? "🌡️ Limit outdoor activities - stay hydrated" :
                 data.uv_index > 8 ? "☀️ Use strong sun protection" :
                 data.air_quality > 100 ? "😷 Consider indoor activities due to air quality" :
                 "✅ Good conditions for outdoor activities"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
