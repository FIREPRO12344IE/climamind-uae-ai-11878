import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
}

const WeatherChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    const { data } = await supabase
      .from('weather_data')
      .select('temperature, humidity, timestamp')
      .eq('city', 'Dubai')
      .order('timestamp', { ascending: true })
      .limit(24);

    if (data) {
      const formatted = data.map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: Number(d.temperature),
        humidity: Number(d.humidity)
      }));
      setChartData(formatted);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">Dubai - Temperature & Humidity Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            name="Temperature (°C)"
          />
          <Line 
            type="monotone" 
            dataKey="humidity" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={2}
            name="Humidity (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
