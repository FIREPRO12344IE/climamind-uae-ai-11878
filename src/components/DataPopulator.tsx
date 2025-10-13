import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const DataPopulator = () => {
  const [isPopulating, setIsPopulating] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    checkForData();
  }, []);

  const checkForData = async () => {
    const { data } = await supabase
      .from('weather_data')
      .select('id')
      .limit(1);
    
    setHasData(data && data.length > 0);
  };

  const populateData = async () => {
    setIsPopulating(true);
    try {
      // Load real weather data
      const { error: weatherError } = await supabase.functions.invoke('fetch-weather');
      if (weatherError) throw weatherError;

      // Load mock resource and transport data
      const { error: mockError } = await supabase.functions.invoke('populate-mock-data');
      if (mockError) throw mockError;
      
      toast.success("Real weather data and sample data loaded successfully!");
      setHasData(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load data");
    } finally {
      setIsPopulating(false);
    }
  };

  if (hasData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-md text-center space-y-6">
        <div className="text-6xl animate-float">🌍</div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome to ClimaMind UAE</h2>
          <p className="text-muted-foreground">
            Load real-time data to see the dashboard in action with live weather from Open-Meteo API, simulated traffic, resources, and transport.
          </p>
        </div>
        <Button 
          onClick={populateData} 
          disabled={isPopulating}
          className="w-full"
          size="lg"
        >
          {isPopulating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading Data...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Load Sample Data
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DataPopulator;
