import { useEffect, useState } from "react";

interface EcoEvent {
  id: string;
  title: string;
  date: string;
  icon: string;
}

const EcoModule = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const pollutionTips = [
    {
      id: 1,
      icon: "🚗",
      text: "Reduce car use: carpool, walk, or bike — cleaner air for everyone.",
    },
    {
      id: 2,
      icon: "🏭",
      text: "Cut industrial pollution: support eco-friendly businesses & green tech.",
    },
    {
      id: 3,
      icon: "♻️",
      text: "Reduce waste: recycle, compost, and minimize single-use plastics.",
    },
    {
      id: 4,
      icon: "🌫️",
      text: "Conserve energy: switch off unused lights, use LED & efficient devices.",
    },
    {
      id: 5,
      icon: "💨",
      text: "Track air quality: know when to avoid outdoor exposure.",
    },
  ];

  const ecoActions = [
    {
      id: 1,
      icon: "🌳",
      text: "Plant trees and greenery — they clean the air and cool our cities.",
    },
    {
      id: 2,
      icon: "🏞️",
      text: "Join community clean-ups — rivers, beaches, streets.",
    },
    {
      id: 3,
      icon: "💡",
      text: "Adopt renewable energy at home — solar panels, efficient appliances.",
    },
    {
      id: 4,
      icon: "🛍️",
      text: "Support sustainable brands and reduce plastic consumption.",
    },
  ];

  const events: EcoEvent[] = [
    {
      id: "1",
      title: "Dubai Creek Clean-Up Drive",
      date: "Oct 20, 2025",
      icon: "🌱",
    },
    {
      id: "2",
      title: "Abu Dhabi Beach Cleaning",
      date: "Oct 22, 2025",
      icon: "🌊",
    },
    {
      id: "3",
      title: "Sharjah Eco March",
      date: "Oct 25, 2025",
      icon: "🌿",
    },
    {
      id: "4",
      title: "Al Ain Solar Awareness Workshop",
      date: "Oct 28, 2025",
      icon: "🌞",
    },
    {
      id: "5",
      title: "Ajman Turtle Conservation Program",
      date: "Nov 1, 2025",
      icon: "🐢",
    },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 rounded-full bg-green-400/30 animate-float" />
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-green-300/40 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-5 h-5 rounded-full bg-emerald-400/30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-60 right-1/3 w-3 h-3 rounded-full bg-teal-400/40 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Hero Header */}
      <div className={`glass-card p-8 text-center relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            🌍 Let's Reduce Pollution & Save Our Planet
          </h1>
          <p className="text-lg text-muted-foreground">
            Simple changes make big differences — for you, your city, your world.
          </p>
        </div>
      </div>

      {/* Pollution Awareness Bubbles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-6 glow-text">
          🌱 Pollution Awareness Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutionTips.map((tip, index) => (
            <div
              key={tip.id}
              className={`glass-card p-6 hover-glow group cursor-pointer transition-all duration-500 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl group-hover:scale-125 transition-transform duration-300">
                  {tip.icon}
                </span>
                <p className="text-sm leading-relaxed">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eco Action Bubbles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-6 glow-text">
          🌿 Eco Action & Environment Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ecoActions.map((action, index) => (
            <div
              key={action.id}
              className={`glass-card p-6 hover-glow group cursor-pointer transition-all duration-500 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${(index + pollutionTips.length) * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl group-hover:scale-125 transition-transform duration-300">
                  {action.icon}
                </span>
                <p className="text-sm leading-relaxed">{action.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Green Initiatives Banner */}
      <div className="glass-card p-8 relative overflow-hidden hover-glow">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-teal-500/20 animate-pulse-slow" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-8 glow-text bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            💚 UAE Community Green Initiatives
          </h2>
          
          {/* Upcoming Events */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-accent/10 transition-all duration-300 hover:translate-x-2 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${(index + pollutionTips.length + ecoActions.length) * 100}ms` }}
              >
                <span className="text-3xl">{event.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoModule;
