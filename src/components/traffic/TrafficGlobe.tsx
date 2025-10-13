interface TrafficGlobeProps {
  trafficData: any[];
}

const TrafficGlobe = ({ trafficData }: TrafficGlobeProps) => {
  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">UAE Traffic Map</h3>
      <div className="h-[400px] rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center border border-border/50">
        <div className="text-center space-y-2">
          <div className="text-6xl animate-float">🌍</div>
          <p className="text-muted-foreground">Interactive 3D Globe</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Real-time traffic visualization across UAE cities. 
            Click on cities to view detailed traffic information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrafficGlobe;
