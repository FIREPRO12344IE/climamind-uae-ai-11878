import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import WeatherCard from "./WeatherCard";
import WeatherChart from "./WeatherChart";
import { Loader2, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface WeatherData {
  id: string;
  city: string;
  temperature: number;
  humidity: number;
  windspeed: number;
  air_quality: number;
  uv_index: number;
  rainfall: number;
  timestamp: string;
}

const UAE_CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];

const WeatherModule = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiMessages, setAiMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  useEffect(() => {
    fetchWeatherData();
    
    // Fetch real weather data every 10 minutes
    const weatherInterval = setInterval(() => {
      fetchRealWeatherData();
    }, 10 * 60 * 1000);
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('weather-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weather_data'
        },
        () => {
          fetchWeatherData();
        }
      )
      .subscribe();

    return () => {
      clearInterval(weatherInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRealWeatherData = async () => {
    try {
      await supabase.functions.invoke('fetch-weather');
    } catch (error) {
      console.error('Error fetching real weather data:', error);
    }
  };

  const fetchWeatherData = async () => {
    setLoading(true);
    
    // Fetch latest weather data for each city
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .in('city', UAE_CITIES)
      .order('timestamp', { ascending: false });

    if (!error && data) {
      // Get only the most recent entry for each city
      const latestByCity = UAE_CITIES.map(city => 
        data.find(d => d.city === city)
      ).filter(Boolean) as WeatherData[];
      
      setWeatherData(latestByCity);
    }
    
    setLoading(false);
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim() || aiLoading) return;

    const userMessage = aiInput;
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setAiLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('climabot-chat', {
        body: { message: userMessage }
      });

      if (error) throw error;

      setAiMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const quickQuestions = [
    "Can I go jogging right now?",
    "Will it rain today?",
    "What's the UV index?",
    "Is it too hot outside?"
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Weather Assistant Banner */}
      <div className="glass-card p-6 border-l-4 border-primary hover-glow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                ClimaBot AI Assistant
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ask me anything about UAE weather, traffic, or activity recommendations based on real-time data!
              </p>
              {!showAiChat && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setShowAiChat(true);
                        setAiInput(q);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={() => setShowAiChat(!showAiChat)}
            variant={showAiChat ? "secondary" : "default"}
            size="sm"
            className="shrink-0"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {showAiChat ? "Hide Chat" : "Open Chat"}
          </Button>
        </div>

        {/* AI Chat Interface */}
        {showAiChat && (
          <div className="mt-6 space-y-4 border-t border-border/50 pt-4">
            <div className="h-[300px] overflow-y-auto space-y-3 pr-2">
              {aiMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Sparkles className="w-12 h-12 mx-auto text-primary/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Ask me about weather conditions, traffic, or outdoor activities!
                    </p>
                  </div>
                </div>
              ) : (
                aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-lg ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/80 border border-border/50"
                      }`}
                    >
                      <div className="text-sm space-y-2">
                        {msg.content.split('\n').map((line, lineIdx) => {
                          const isHeader = /^[🌤️🏃‍♂️🚦⚡🌍💡🔴🟡🟢⚠️✅❌]/u.test(line);
                          const isBullet = /^[•\-–—]/.test(line.trim());
                          
                          if (line.trim() === '') return <div key={lineIdx} className="h-2" />;
                          if (isHeader) return <div key={lineIdx} className="font-semibold text-base">{line}</div>;
                          if (isBullet) return <div key={lineIdx} className="pl-2 text-muted-foreground">{line}</div>;
                          
                          const formattedLine = line
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                            .replace(/__(.*?)__/g, '<strong class="font-bold">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
                          
                          return <div key={lineIdx} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg border border-border/50">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
                placeholder="Ask about weather, traffic, or activities..."
                disabled={aiLoading}
                className="flex-1"
              />
              <Button onClick={sendAiMessage} disabled={aiLoading || !aiInput.trim()}>
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Alert Banner */}
      <div className="glass-card p-4 border-l-4 border-accent hover-glow">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-accent">Weather Alert</h3>
            <p className="text-sm text-muted-foreground">
              Real-time data from Open-Meteo API. High humidity expected tomorrow — stay hydrated and plan indoor activities.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Climate Overview Table */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">UAE Climate Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">City</th>
                <th className="text-left py-3 px-4 font-semibold">Temperature</th>
                <th className="text-left py-3 px-4 font-semibold">Humidity</th>
                <th className="text-left py-3 px-4 font-semibold">Wind</th>
                <th className="text-left py-3 px-4 font-semibold">Air Quality</th>
                <th className="text-left py-3 px-4 font-semibold">UV Index</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((data) => (
                <tr key={data.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                  <td className="py-4 px-4 font-medium">{data.city}</td>
                  <td className="py-4 px-4">
                    <span className="text-2xl font-bold">{Math.round(data.temperature)}°C</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
                          style={{ width: `${data.humidity}%` }}
                        />
                      </div>
                      <span className="text-sm">{Math.round(data.humidity)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm">{data.windspeed} km/h</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      data.air_quality <= 50 ? 'bg-green-500/20 text-green-400' :
                      data.air_quality <= 100 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {data.air_quality <= 50 ? 'Good' : 
                       data.air_quality <= 100 ? 'Moderate' : 
                       'Poor'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      data.uv_index <= 2 ? 'bg-green-500/20 text-green-400' :
                      data.uv_index <= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                      data.uv_index <= 7 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {data.uv_index.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherData.map((data) => (
          <WeatherCard key={data.id} data={data} />
        ))}
      </div>

      {/* Weather Chart */}
      <WeatherChart />
    </div>
  );
};

export default WeatherModule;
