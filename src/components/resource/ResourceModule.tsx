import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PowerCard from "./PowerCard";
import WaterCard from "./WaterCard";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResourceData();

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
  const isPeakHours = currentHour >= 17 && currentHour <= 22;

  return (
    <div className="space-y-6">
      {isPeakHours && (
        <div className="glass-card p-4 border-l-4 border-accent hover-glow">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-semibold text-accent">Peak Hours Alert</h3>
              <p className="text-sm text-muted-foreground">
                Peak electricity usage expected 6 PM – 10 PM — consider reducing AC load to help city resources.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Resource Overview</h3>
        <p className="text-muted-foreground">
          Monitor real-time power and water consumption across UAE cities.
        </p>
      </div>
    </div>
  );
};

export default ResourceModule;