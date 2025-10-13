-- Add visibility column to weather_data table
ALTER TABLE weather_data ADD COLUMN IF NOT EXISTS visibility numeric;

-- Create resource_data table for electricity and water usage
CREATE TABLE IF NOT EXISTS public.resource_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city text NOT NULL,
  electricity_usage numeric NOT NULL,
  water_usage numeric NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for resource_data
ALTER TABLE public.resource_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to resource data
CREATE POLICY "Allow public read access to resource data"
ON public.resource_data
FOR SELECT
USING (true);

-- Create transport_data table for bus/train schedules and crowding
CREATE TABLE IF NOT EXISTS public.transport_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city text NOT NULL,
  transport_type text NOT NULL, -- 'bus' or 'train'
  line_number text NOT NULL,
  route_name text,
  predicted_crowding text NOT NULL, -- 'low', 'moderate', 'high'
  delay_minutes integer DEFAULT 0,
  timestamp timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for transport_data
ALTER TABLE public.transport_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to transport data
CREATE POLICY "Allow public read access to transport data"
ON public.transport_data
FOR SELECT
USING (true);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.resource_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transport_data;