const TransportTimeline = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIntensity = (hour: number) => {
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20)) {
      return { color: 'bg-red-500', label: 'Peak' };
    }
    if ((hour >= 6 && hour < 7) || (hour >= 9 && hour < 11) || (hour >= 16 && hour < 17) || (hour >= 20 && hour < 22)) {
      return { color: 'bg-yellow-500', label: 'Busy' };
    }
    return { color: 'bg-green-500', label: 'Smooth' };
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b border-border/50">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-xl">🚇</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Dubai Metro</h3>
            <div className="space-y-2 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Operating Hours:</span>
                <span>5:00 AM – 1:00 AM (Sat–Thu)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Friday:</span>
                <span>10:00 AM – 1:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Peak Hours:</span>
                <span className="text-red-400">7:00–9:00 AM, 5:00–8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">24-Hour Crowding Timeline</p>
          <div className="flex items-center gap-1 h-12">
            {hours.map((hour) => {
              const { color, label } = getIntensity(hour);
              return (
                <div
                  key={hour}
                  className="flex-1 relative group"
                  title={`${hour}:00 - ${label}`}
                >
                  <div className={`h-12 ${color} rounded transition-all hover:scale-105`} />
                  {hour % 3 === 0 && (
                    <span className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
                      {hour}:00
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b border-border/50">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-xl">🚌</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Dubai Bus</h3>
            <div className="space-y-2 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Operating Hours:</span>
                <span>4:00 AM – 12:00 AM (Daily)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Peak Hours:</span>
                <span className="text-red-400">6:30–8:30 AM, 5:00–7:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">24-Hour Crowding Timeline</p>
          <div className="flex items-center gap-1 h-12">
            {hours.map((hour) => {
              const { color } = getIntensity(hour);
              return (
                <div
                  key={hour}
                  className="flex-1 relative group"
                >
                  <div className={`h-12 ${color} rounded transition-all hover:scale-105`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>Smooth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded" />
          <span>Busy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span>Peak / Crowded</span>
        </div>
      </div>
    </div>
  );
};

export default TransportTimeline;
