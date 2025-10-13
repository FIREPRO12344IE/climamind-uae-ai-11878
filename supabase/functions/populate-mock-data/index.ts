import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UAE_CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Populating mock resource and transport data...');

    // Generate resource data
    const resourceData = UAE_CITIES.map(city => ({
      city,
      electricity_usage: Math.floor(Math.random() * 500) + 200, // 200-700 MW
      water_usage: Math.floor(Math.random() * 300) + 100, // 100-400 million gallons
    }));

    // Generate transport data
    const transportData: Array<{
      city: string;
      transport_type: string;
      line_number: string;
      route_name: string;
      predicted_crowding: string;
      delay_minutes: number;
    }> = [];
    const busLines = ['11', '32', '67', 'E100', 'E400'];
    const trainLines = ['Red Line', 'Green Line', 'Blue Line'];
    const crowdingLevels = ['low', 'moderate', 'high'];

    UAE_CITIES.forEach(city => {
      // Add bus data
      busLines.forEach(line => {
        transportData.push({
          city,
          transport_type: 'bus',
          line_number: line,
          route_name: `${city} - ${line}`,
          predicted_crowding: crowdingLevels[Math.floor(Math.random() * crowdingLevels.length)],
          delay_minutes: Math.floor(Math.random() * 15),
        });
      });

      // Add train data for major cities
      if (['Dubai', 'Abu Dhabi', 'Sharjah'].includes(city)) {
        trainLines.forEach(line => {
          transportData.push({
            city,
            transport_type: 'train',
            line_number: line,
            route_name: `${city} Metro - ${line}`,
            predicted_crowding: crowdingLevels[Math.floor(Math.random() * crowdingLevels.length)],
            delay_minutes: Math.floor(Math.random() * 10),
          });
        });
      }
    });

    // Insert resource data
    const { error: resourceError } = await supabase
      .from('resource_data')
      .insert(resourceData);

    if (resourceError) {
      console.error('Error inserting resource data:', resourceError);
      throw resourceError;
    }

    // Insert transport data
    const { error: transportError } = await supabase
      .from('transport_data')
      .insert(transportData);

    if (transportError) {
      console.error('Error inserting transport data:', transportError);
      throw transportError;
    }

    console.log('Mock data successfully populated');

    return new Response(
      JSON.stringify({ 
        success: true, 
        resourceCount: resourceData.length,
        transportCount: transportData.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in populate-mock-data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});