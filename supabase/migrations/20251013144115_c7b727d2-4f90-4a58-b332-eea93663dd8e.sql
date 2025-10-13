-- Create weather_data table
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  windspeed DECIMAL(5,2),
  air_quality DECIMAL(5,2),
  uv_index DECIMAL(4,2),
  rainfall DECIMAL(5,2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create traffic_data table
CREATE TABLE public.traffic_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  congestion_level TEXT NOT NULL,
  avg_speed DECIMAL(5,2),
  alert_status TEXT NOT NULL,
  route_name TEXT,
  delay_minutes INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (this is a public dashboard)
CREATE POLICY "Allow public read access to weather data" 
ON public.weather_data 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to traffic data" 
ON public.traffic_data 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_weather_city_timestamp ON public.weather_data(city, timestamp DESC);
CREATE INDEX idx_traffic_city_timestamp ON public.traffic_data(city, timestamp DESC);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.weather_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.traffic_data;