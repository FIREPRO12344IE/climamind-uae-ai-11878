import { useState } from "react";

interface TrafficGlobeProps {
  trafficData: any[];
}

interface CityInfo {
  name: string;
  metro: string;
  bus: string;
}

const cityData: Record<string, CityInfo> = {
  "Dubai": {
    name: "Dubai",
    metro: "Peak: 7–9 AM / 5–8 PM",
    bus: "Delay: +10 mins avg"
  },
  "Sharjah": {
    name: "Sharjah",
    metro: "No metro service",
    bus: "Delay: +15 mins avg"
  },
  "Abu Dhabi": {
    name: "Abu Dhabi",
    metro: "No metro service",
    bus: "Delay: +8 mins avg"
  }
};

const TrafficGlobe = ({ trafficData }: TrafficGlobeProps) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">UAE Traffic & Transport Map</h3>
      <div className="relative h-[500px] rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-border/50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-8xl animate-float">🌍</div>
        </div>

        <div className="absolute top-1/4 left-1/3 group">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setHoveredCity("Dubai")}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-red-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
            <div className="absolute top-0 left-6 w-16 h-0.5 bg-blue-500 animate-pulse" />
            <div className="absolute top-0 left-6 w-12 h-0.5 bg-green-500 animate-pulse" style={{ top: '8px' }} />
            {hoveredCity === "Dubai" && cityData["Dubai"] && (
              <div className="absolute top-8 left-0 w-48 glass-card p-3 z-10 text-xs space-y-1">
                <p className="font-semibold">{cityData["Dubai"].name}</p>
                <p className="text-blue-400">🚇 {cityData["Dubai"].metro}</p>
                <p className="text-green-400">🚌 {cityData["Dubai"].bus}</p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-1/3 left-1/4 group">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setHoveredCity("Sharjah")}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-yellow-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
            <div className="absolute top-0 left-6 w-10 h-0.5 bg-green-500 animate-pulse" />
            {hoveredCity === "Sharjah" && cityData["Sharjah"] && (
              <div className="absolute top-8 left-0 w-48 glass-card p-3 z-10 text-xs space-y-1">
                <p className="font-semibold">{cityData["Sharjah"].name}</p>
                <p className="text-muted-foreground">🚇 {cityData["Sharjah"].metro}</p>
                <p className="text-green-400">🚌 {cityData["Sharjah"].bus}</p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 group">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setHoveredCity("Abu Dhabi")}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-green-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
            <div className="absolute top-0 left-6 w-14 h-0.5 bg-green-500 animate-pulse" />
            {hoveredCity === "Abu Dhabi" && cityData["Abu Dhabi"] && (
              <div className="absolute top-8 left-0 w-48 glass-card p-3 z-10 text-xs space-y-1">
                <p className="font-semibold">{cityData["Abu Dhabi"].name}</p>
                <p className="text-muted-foreground">🚇 {cityData["Abu Dhabi"].metro}</p>
                <p className="text-green-400">🚌 {cityData["Abu Dhabi"].bus}</p>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-500" />
              <span>Metro Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-500" />
              <span>Bus Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Heavy Traffic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficGlobe;
