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
      supabase.removeChannel(channel);
    };
  }, []);

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
