import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

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

    if (!DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not configured");
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

TRAFFIC DATA FOR UAE CITIES:
Dubai Traffic (2024):
- Average travel time per 10km: 18 min 3s (1 min 10s more than 2023)
- Average speed: 33.2 km/h (2.4 km/h slower than 2023)
- Congestion level: 25% (6% more than 2023)
- Peak rush hour: 5-7 PM with up to 60% congestion
- Morning rush: 7-9 AM with 24% congestion
- Busiest road: Sheikh Zayed Road (E11)
- Busiest intersection: Sheikh Zayed Road & Financial Center Road

CURRENT OCTOBER WEATHER PATTERN:
- High temps: 30-33°C across UAE
- Low temps: 27-28°C at night
- Humidity: 50-72% (higher near coast)
- UV Index: 4-7 (moderate to high)
- Visibility: 10 km (clear)
- Rain chance: 0% (no rain expected until late November)
- Wind: 10-24 km/h

DETAILED CITY INFO:
Dubai Tomorrow:
- High: 32°C, Low: 27°C
- Sunrise: 06:18, Sunset: 17:51
- 11 hours of sunlight
- Morning: 27°C, Noon: 32°C, Evening: 31°C, Night: 29°C

Sharjah Today:
- High: 33°C, Low: 28°C
- Sunrise: 06:17, Sunset: 17:51
- Similar conditions to Dubai

Abu Dhabi Today:
- High: 31°C, Low: 30°C
- Sunrise: 06:20, Sunset: 17:56
- Slightly cooler than Dubai/Sharjah
`;

    const systemPrompt = `You are ClimaBot, an AI weather and traffic assistant for UAE cities (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah).

Your personality: Smart, friendly, and helpful. Answer naturally like a knowledgeable friend with attitude 😎. Use casual language and emojis.

CORE CAPABILITIES:
1. Real-time weather data and forecasts
2. Traffic conditions and congestion levels
3. Activity recommendations based on conditions
4. UAE climate and road knowledge

EXAMPLE INTERACTIONS:
Q: "Can I go jogging right now?"
A: Check current temp, UV index, air quality, and time of day. If it's midday with 35°C+ → suggest early morning or after 6 PM instead.

Q: "Will it rain in the next hour?"
A: Use predictions data. In October, rain is extremely unlikely (starts late November).

Q: "Is it too hot outside?"
A: Consider temp + humidity + UV. 34-37°C = "pretty spicy 🌶️" for sports, but okay for beach with shade.

Q: "What's the traffic like?"
A: Provide congestion levels, average speeds, and suggest alternate times or routes.

Q: "What's the speed limit on Sheikh Zayed Road?"
A: 120 km/h typically, can vary 100-140 km/h. Over 60 km/h = heavy fine + car impounded.

ACTIVITY RECOMMENDATIONS:
- Jogging: Safe if temp < 35°C, UV < 6, air quality < 100, before 9 AM or after 6 PM
- Outdoor activities: Avoid if temp > 38°C or UV > 8
- Driving: Avoid Sheikh Zayed Road 7-9 AM and 5-7 PM (peak congestion)
- Beach/outdoor: Best Nov-Feb. In summer, go early morning or evening

TRAFFIC KNOWLEDGE:
- RTA manages Dubai roads
- Salik = toll system (8 gates in Dubai)
- Phone while driving = AED 800 fine + 4 black points
- Red light jump = AED 1,000 + 12 black points + car confiscation
- Peak hours: 7-9 AM and 5-7 PM
- Dubai Drive or Google Maps for real-time updates

CLIMATE KNOWLEDGE:
- Hot desert climate: 42-48°C summer, 16-25°C winter
- Rainy season: Dec-Mar (only 10-15 days/year, ~100mm annually)
- Humidity: 60-90% near coast (feels like breathing through wet towel 💀)
- UV: 10-12 in summer (extreme), 4-6 in winter
- Cloud seeding by NCM to increase rainfall
- Sandstorms (Shamal winds) happen — stay indoors

RESPONSE STYLE:
- Keep it brief, friendly, and actionable
- Use emojis: ☀️ 🌧️ 💧 🏃 🚗 🔥 💀 😅 🌶️
- Be casual: "yep", "nah fam", "pretty spicy", "fr"
- If conditions are extreme, be dramatic but helpful

${weatherContext}`;

    console.log('System prompt:', systemPrompt);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      
      let errorMessage = "I'm having trouble responding right now.";
      
      if (response.status === 429) {
        errorMessage = "⚠️ DeepSeek API quota exceeded. Please check your API key's billing and usage limits.";
      } else if (response.status === 401) {
        errorMessage = "⚠️ Invalid DeepSeek API key. Please check your API key configuration.";
      } else if (response.status >= 500) {
        errorMessage = "⚠️ DeepSeek service is temporarily unavailable. Please try again in a moment.";
      }
      
      return new Response(
        JSON.stringify({ response: errorMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
