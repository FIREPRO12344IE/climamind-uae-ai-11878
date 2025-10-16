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

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">⚡ Power Consumption</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                🏠 Residential Power Consumption
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Average Daily Use:</span> Approximately 200 kWh per household.
                </p>
                <a href="#" className="text-xs text-primary hover:underline">Enerdata</a>
              </div>
            </div>

            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                🏢 Commercial Power Consumption
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Average Daily Use:</span> Around 200 kWh per establishment.
                </p>
                <a href="#" className="text-xs text-primary hover:underline">Enerdata</a>
              </div>
            </div>

            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                🌞 Renewable Energy Consumption
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Average Daily Use:</span> Approximately 321 kWh per capita.
                </p>
                <a href="#" className="text-xs text-primary hover:underline">Enerdata</a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">💧 Water Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                💦 Water Usage
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Daily Consumption:</span> Approximately 550 liters per person.
                </p>
                <a href="#" className="text-xs text-primary hover:underline">Grc</a>
              </div>
            </div>

            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                🏙️ Sharjah Conservation Update
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Water Waste Reduction:</span> Reduced by 12% this week.
                </p>
                <a href="#" className="text-xs text-primary hover:underline">AP News</a>
              </div>
            </div>

            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                📊 Resource Usage Trends
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Electricity Generation Mix:</span> In 2023, the UAE's electricity generation was approximately 28% low-carbon, with 72% from fossil fuels.
                </p>
                <a href="#" className="text-xs text-primary hover:underline">Ember Energy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceModule;