import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UAE major cities coordinates
const UAE_CITIES = [
  { name: "Dubai", latitude: 25.276987, longitude: 55.296249 },
  { name: "Abu Dhabi", latitude: 24.453884, longitude: 54.377344 },
  { name: "Sharjah", latitude: 25.357475, longitude: 55.391080 },
  { name: "Ajman", latitude: 25.405216, longitude: 55.513226 },
  { name: "Ras Al Khaimah", latitude: 25.789217, longitude: 55.943036 },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching weather data from Open-Meteo API...');

    // Fetch weather data for all UAE cities
    const weatherPromises = UAE_CITIES.map(async (city) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,visibility,uv_index&daily=precipitation_sum&timezone=auto`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch weather for ${city.name}`);
      }
      
      const data = await response.json();
      const current = data.current;
      
      return {
        city: city.name,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windspeed: current.wind_speed_10m,
        visibility: current.visibility / 1000, // Convert to km
        uv_index: current.uv_index || 0,
        rainfall: data.daily?.precipitation_sum?.[0] || 0,
        air_quality: Math.floor(Math.random() * 100) + 20, // Mock air quality for now
      };
    });

    const weatherData = await Promise.all(weatherPromises);

    // Insert weather data into Supabase
    const { error: insertError } = await supabase
      .from('weather_data')
      .insert(weatherData);

    if (insertError) {
      console.error('Error inserting weather data:', insertError);
      throw insertError;
    }

    console.log('Weather data successfully fetched and stored');

    return new Response(
      JSON.stringify({ success: true, data: weatherData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-weather:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});