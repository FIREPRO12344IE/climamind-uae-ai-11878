import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TransportCard from "./TransportCard";
import TransportTimeline from "./TransportTimeline";
import { Loader2 } from "lucide-react";

interface TransportData {
  id: string;
  city: string;
  transport_type: string;
  line_number: string;
  route_name: string;
  predicted_crowding: string;
  delay_minutes: number;
  timestamp: string;
}

const TransportModule = () => {
  const [transportData, setTransportData] = useState<TransportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bus' | 'train'>('all');

  useEffect(() => {
    fetchTransportData();
    
    const channel = supabase
      .channel('transport-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transport_data'
        },
        () => {
          fetchTransportData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const fetchTransportData = async () => {
    setLoading(true);
    
    let query = supabase
      .from('transport_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    if (filter !== 'all') {
      query = query.eq('transport_type', filter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setTransportData(data);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-4 border-l-4 border-accent hover-glow">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚍</span>
          <div>
            <h3 className="font-semibold text-accent">Smart Transport Suggestion</h3>
            <p className="text-sm text-muted-foreground">
              Take Bus 32 instead of driving — saves 25 mins and reduces traffic congestion.
            </p>
          </div>
        </div>
      </div>

      <TransportTimeline />

      <div>
        <h3 className="text-lg font-semibold mb-4">Live Transport Status</h3>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All Transport
          </button>
          <button
            onClick={() => setFilter('bus')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'bus'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🚌 Buses
          </button>
          <button
            onClick={() => setFilter('train')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'train'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            🚇 Metro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transportData.map((data) => (
            <TransportCard key={data.id} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportModule;