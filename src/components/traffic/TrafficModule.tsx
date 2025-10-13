import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TrafficCard from "./TrafficCard";
import TrafficGlobe from "./TrafficGlobe";
import { Loader2 } from "lucide-react";

interface TrafficData {
  id: string;
  city: string;
  congestion_level: string;
  avg_speed: number;
  alert_status: string;
  route_name: string | null;
  delay_minutes: number | null;
  timestamp: string;
}

const UAE_CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];

const TrafficModule = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrafficData();
    generateTrafficFromWeather();
    
    // Update traffic based on weather every 5 minutes
    const trafficInterval = setInterval(() => {
      generateTrafficFromWeather();
    }, 5 * 60 * 1000);
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('traffic-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'traffic_data'
        },
        () => {
          fetchTrafficData();
        }
      )
      .subscribe();

    return () => {
      clearInterval(trafficInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const generateTrafficFromWeather = async () => {
    // Fetch latest weather data to determine traffic conditions
    const { data: weatherData } = await supabase
      .from('weather_data')
      .select('*')
      .in('city', UAE_CITIES)
      .order('timestamp', { ascending: false })
      .limit(5);

    if (!weatherData) return;

    const trafficData = weatherData.map(weather => {
      const visibility = weather.visibility || 10;
      let congestionLevel = 'smooth';
      let avgSpeed = 80;
      let alertStatus = '🟢 Smooth';

      if (visibility > 8) {
        congestionLevel = 'smooth';
        avgSpeed = 80 + Math.floor(Math.random() * 20);
        alertStatus = '🟢 Smooth';
      } else if (visibility > 4) {
        congestionLevel = 'moderate';
        avgSpeed = 50 + Math.floor(Math.random() * 20);
        alertStatus = '🟡 Moderate';
      } else {
        congestionLevel = 'heavy';
        avgSpeed = 20 + Math.floor(Math.random() * 20);
        alertStatus = '🔴 Heavy';
      }

      return {
        city: weather.city,
        congestion_level: congestionLevel,
        avg_speed: avgSpeed,
        alert_status: alertStatus,
        route_name: `Main Route ${weather.city}`,
        delay_minutes: congestionLevel === 'heavy' ? Math.floor(Math.random() * 30) + 10 : 
                      congestionLevel === 'moderate' ? Math.floor(Math.random() * 15) : 0,
      };
    });

    // Insert traffic data
    await supabase.from('traffic_data').insert(trafficData);
  };

  const fetchTrafficData = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('traffic_data')
      .select('*')
      .in('city', UAE_CITIES)
      .order('timestamp', { ascending: false });

    if (!error && data) {
      // Get only the most recent entry for each city
      const latestByCity = UAE_CITIES.map(city => 
        data.find(d => d.city === city)
      ).filter(Boolean) as TrafficData[];
      
      setTrafficData(latestByCity);
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
          <span className="text-2xl">🚦</span>
          <div>
            <h3 className="font-semibold text-accent">Traffic Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Traffic between Sharjah and Dubai will likely be heavy at 5 PM based on current visibility trends. Consider alternative routes.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Globe */}
      <TrafficGlobe trafficData={trafficData} />

      {/* Traffic Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Traffic Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trafficData.map((data) => (
            <TrafficCard key={data.id} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficModule;
