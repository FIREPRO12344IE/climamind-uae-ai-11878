import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeatherModule from "./weather/WeatherModule";
import TrafficModule from "./traffic/TrafficModule";
import ResourceModule from "./resource/ResourceModule";
import TransportModule from "./transport/TransportModule";
import ClimaBot from "./ai/ClimaBot";
import DataPopulator from "./DataPopulator";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("weather");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DataPopulator />
      
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse-slow" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl">🏙️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold glow-text">ClimaMind UAE</h1>
                <p className="text-sm text-muted-foreground">AI Smart City Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
                🇦🇪 United Arab Emirates
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card p-1 h-auto grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger 
              value="weather" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3 text-sm md:text-base"
            >
              🌤 Weather
            </TabsTrigger>
            <TabsTrigger 
              value="traffic" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3 text-sm md:text-base"
            >
              🚦 Traffic
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3 text-sm md:text-base"
            >
              ⚡ Resources
            </TabsTrigger>
            <TabsTrigger 
              value="transport" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3 text-sm md:text-base"
            >
              🚍 Transport
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather" className="space-y-6">
            <WeatherModule />
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <TrafficModule />
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ResourceModule />
          </TabsContent>

          <TabsContent value="transport" className="space-y-6">
            <TransportModule />
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Assistant */}
      <ClimaBot />
    </div>
  );
};

export default Dashboard;
