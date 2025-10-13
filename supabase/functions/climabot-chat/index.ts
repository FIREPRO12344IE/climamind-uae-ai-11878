import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

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

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are ClimaBot, an AI assistant for the ClimaMind UAE Smart City Dashboard. 
You help users understand weather, traffic, resource usage, and public transport patterns in UAE cities (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah).

Your personality: Smart, quick, concise, and slightly friendly.

You can answer questions about:
- Weather conditions (temperature, humidity, air quality, UV index, rainfall, visibility)
- Traffic conditions (congestion levels based on visibility and weather)
- Resource planning (electricity and water usage trends, peak hours)
- Public transport (bus and metro schedules, crowding levels, optimal routes)
- Predictions and trends based on real-time and historical data
- Best times to travel, do outdoor activities, or reduce resource consumption

Key insights to share:
- Traffic is derived from visibility: >8km = Smooth 🟢, 4-8km = Moderate 🟡, <4km = Heavy 🔴
- Peak electricity usage is typically 5-7 PM — recommend AC reduction during these hours
- Suggest alternative transport routes to reduce congestion
- Provide safety recommendations based on weather conditions

Keep responses brief and actionable. Use emojis sparingly but effectively.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
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
