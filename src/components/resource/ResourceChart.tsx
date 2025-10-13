import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ResourceChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    const { data, error } = await supabase
      .from('resource_data')
      .select('*')
      .order('timestamp', { ascending: true })
      .limit(50);

    if (!error && data) {
      const formattedData = data.map((item) => ({
        time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        electricity: item.electricity_usage,
        water: item.water_usage,
        city: item.city,
      }));
      setChartData(formattedData);
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4">Resource Usage Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="electricity" 
            stroke="#fbbf24" 
            strokeWidth={2}
            name="Electricity (MW)"
          />
          <Line 
            type="monotone" 
            dataKey="water" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Water (MG)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceChart;