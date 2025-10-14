import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch latest weather data for all UAE cities
    const { data: weatherData } = await supabase
      .from('weather_data')
      .select('*')
      .in('city', ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'])
      .order('timestamp', { ascending: false })
      .limit(10);

    // Get latest reading for each city
    const latestWeather = weatherData?.reduce((acc: any, curr: any) => {
      if (!acc[curr.city] || new Date(curr.timestamp) > new Date(acc[curr.city].timestamp)) {
        acc[curr.city] = curr;
      }
      return acc;
    }, {});

    // Simple prediction: analyze trends from last 2 hours of data
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { data: historicalData } = await supabase
      .from('weather_data')
      .select('*')
      .gte('timestamp', twoHoursAgo)
      .order('timestamp', { ascending: true });

    // Calculate trends for predictions
    const predictions: any = {};
    if (historicalData && historicalData.length > 0) {
      ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'].forEach(city => {
        const cityData = historicalData.filter((d: any) => d.city === city);
        if (cityData.length >= 2) {
          const latest = cityData[cityData.length - 1];
          const previous = cityData[0];
          
          predictions[city] = {
            tempTrend: latest.temperature - previous.temperature > 0 ? 'rising' : 'falling',
            tempChange: (latest.temperature - previous.temperature).toFixed(1),
            humidityTrend: latest.humidity - previous.humidity > 0 ? 'rising' : 'falling',
            rainfallRisk: latest.humidity > 80 ? 'high' : latest.humidity > 60 ? 'medium' : 'low'
          };
        }
      });
    }

    const weatherContext = `
CURRENT REAL-TIME WEATHER DATA:
${Object.entries(latestWeather || {}).map(([city, data]: [string, any]) => `
${city}:
- Temperature: ${data.temperature}°C
- Humidity: ${data.humidity}%
- Wind Speed: ${data.windspeed} km/h
- Air Quality: ${data.air_quality} (${data.air_quality < 50 ? 'Good' : data.air_quality < 100 ? 'Moderate' : 'Poor'})
- UV Index: ${data.uv_index}
- Visibility: ${data.visibility} km
- Rainfall: ${data.rainfall} mm
`).join('\n')}

NEXT HOUR PREDICTIONS:
${Object.entries(predictions).map(([city, pred]: [string, any]) => `
${city}:
- Temperature trend: ${pred.tempTrend} (${pred.tempChange > 0 ? '+' : ''}${pred.tempChange}°C in last 2h)
- Humidity trend: ${pred.humidityTrend}
- Rainfall risk: ${pred.rainfallRisk}
`).join('\n')}
`;

    const systemPrompt = `You are ClimaBot, an AI weather assistant for UAE cities.

Your personality: Smart, friendly, and helpful. Answer naturally like a knowledgeable friend.

You MUST answer questions like:
- "Can I go jogging right now?" → Check temperature, UV index, air quality
- "Will it rain in the next hour?" → Use predictions data
- "Is it too hot to go outside?" → Consider temperature + UV index
- "What's the UV index near me?" → Provide current UV data

Use the REAL-TIME DATA and PREDICTIONS provided above to give accurate answers.

Activity recommendations:
- Jogging: Safe if temp < 35°C, UV < 6, air quality < 100
- Outdoor activities: Avoid if temp > 38°C or UV > 8
- Rain gear needed: If rainfall risk is high or humidity > 85%

Keep responses brief, friendly, and actionable. Use relevant emojis (☀️ 🌧️ 💧 🏃).

${weatherContext}`;

    console.log('System prompt:', systemPrompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm having trouble responding right now.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in climabot-chat:', error);
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
