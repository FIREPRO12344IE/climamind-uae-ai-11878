import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ResourceCard from "./ResourceCard";
import ResourceChart from "./ResourceChart";
import { Loader2 } from "lucide-react";

interface ResourceData {
  id: string;
  city: string;
  electricity_usage: number;
  water_usage: number;
  timestamp: string;
}

const UAE_CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];

const ResourceModule = () => {
  const [resourceData, setResourceData] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResourceData();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('resource-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resource_data'
        },
        () => {
          fetchResourceData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchResourceData = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('resource_data')
      .select('*')
      .in('city', UAE_CITIES)
      .order('timestamp', { ascending: false });

    if (!error && data) {
      const latestByCity = UAE_CITIES.map(city => 
        data.find(d => d.city === city)
      ).filter(Boolean) as ResourceData[];
      
      setResourceData(latestByCity);
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

  const currentHour = new Date().getHours();
  const isPeakHours = currentHour >= 17 && currentHour <= 19;

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {isPeakHours && (
        <div className="glass-card p-4 border-l-4 border-accent hover-glow">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-semibold text-accent">Peak Hours Alert</h3>
              <p className="text-sm text-muted-foreground">
                Peak electricity usage expected 5–7 PM — consider reducing AC load to help city resources.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourceData.map((data) => (
          <ResourceCard key={data.id} data={data} />
        ))}
      </div>

      {/* Resource Chart */}
      <ResourceChart />
    </div>
  );
};

export default ResourceModule;