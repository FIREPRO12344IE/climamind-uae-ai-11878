import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];
    
    // Generate sample weather data
    const weatherData = cities.map(city => ({
      city,
      temperature: 25 + Math.random() * 20, // 25-45°C
      humidity: 40 + Math.random() * 40, // 40-80%
      windspeed: 5 + Math.random() * 25, // 5-30 km/h
      air_quality: 30 + Math.random() * 120, // 30-150 AQI
      uv_index: 5 + Math.random() * 8, // 5-13
      rainfall: Math.random() * 5, // 0-5 mm
    }));

    // Generate sample traffic data
    const trafficData = cities.map(city => {
      const congestionLevels = ["Low", "Medium", "High"];
      const alertStatuses = ["smooth", "moderate", "heavy"];
      const randomLevel = Math.floor(Math.random() * 3);
      
      return {
        city,
        congestion_level: congestionLevels[randomLevel],
        avg_speed: 40 + Math.random() * 80, // 40-120 km/h
        alert_status: alertStatuses[randomLevel],
        route_name: `Main Highway - ${city}`,
        delay_minutes: randomLevel * 15 + Math.floor(Math.random() * 15), // 0-45 min
      };
    });

    // Insert data
    const { error: weatherError } = await supabase
      .from('weather_data')
      .insert(weatherData);

    const { error: trafficError } = await supabase
      .from('traffic_data')
      .insert(trafficData);

    if (weatherError) throw weatherError;
    if (trafficError) throw trafficError;

    return new Response(
      JSON.stringify({ 
        message: 'Sample data populated successfully',
        weather: weatherData.length,
        traffic: trafficData.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error populating data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
