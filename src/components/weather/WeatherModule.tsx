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
