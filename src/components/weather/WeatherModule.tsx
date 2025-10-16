import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import WeatherCard from "./WeatherCard";
import WeatherChart from "./WeatherChart";
import { Loader2 } from "lucide-react";

interface WeatherData {
  id: string;
  city: string;
  temperature: number;
  humidity: number;
  windspeed: number;
  air_quality: number;
  uv_index: number;
  rainfall: number;
  timestamp: string;
}

const UAE_CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];

const WeatherModule = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
    
    // Fetch real weather data every 10 minutes
    const weatherInterval = setInterval(() => {
      fetchRealWeatherData();
    }, 10 * 60 * 1000);
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('weather-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weather_data'
        },
        () => {
          fetchWeatherData();
        }
      )
      .subscribe();

    return () => {
      clearInterval(weatherInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRealWeatherData = async () => {
    try {
      await supabase.functions.invoke('fetch-weather');
    } catch (error) {
      console.error('Error fetching real weather data:', error);
    }
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    
    // Fetch latest weather data for each city
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .in('city', UAE_CITIES)
      .order('timestamp', { ascending: false });

    if (!error && data) {
      // Get only the most recent entry for each city
      const latestByCity = UAE_CITIES.map(city => 
        data.find(d => d.city === city)
      ).filter(Boolean) as WeatherData[];
      
      setWeatherData(latestByCity);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className="glass-card p-4 border-l-4 border-accent hover-glow">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-accent">Weather Alert</h3>
            <p className="text-sm text-muted-foreground">
              Real-time data from Open-Meteo API. High humidity expected tomorrow — stay hydrated and plan indoor activities.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Climate Overview Table */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">UAE Climate Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">City</th>
                <th className="text-left py-3 px-4 font-semibold">Temperature</th>
                <th className="text-left py-3 px-4 font-semibold">Humidity</th>
                <th className="text-left py-3 px-4 font-semibold">Wind</th>
                <th className="text-left py-3 px-4 font-semibold">Air Quality</th>
                <th className="text-left py-3 px-4 font-semibold">UV Index</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((data) => (
                <tr key={data.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                  <td className="py-4 px-4 font-medium">{data.city}</td>
                  <td className="py-4 px-4">
                    <span className="text-2xl font-bold">{Math.round(data.temperature)}°C</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
                          style={{ width: `${data.humidity}%` }}
                        />
                      </div>
                      <span className="text-sm">{Math.round(data.humidity)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm">{data.windspeed} km/h</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      data.air_quality <= 50 ? 'bg-green-500/20 text-green-400' :
                      data.air_quality <= 100 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {data.air_quality <= 50 ? 'Good' : 
                       data.air_quality <= 100 ? 'Moderate' : 
                       'Poor'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      data.uv_index <= 2 ? 'bg-green-500/20 text-green-400' :
                      data.uv_index <= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                      data.uv_index <= 7 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {data.uv_index.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherData.map((data) => (
          <WeatherCard key={data.id} data={data} />
        ))}
      </div>

      {/* Weather Chart */}
      <WeatherChart />
    </div>
  );
};

export default WeatherModule;
