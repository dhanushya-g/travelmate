import { Map, Calendar, Hotel, Users, Brain, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description: "Smart algorithms analyze your preferences to create personalized itineraries tailored to your travel style.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Calendar,
    title: "Dynamic Itineraries",
    description: "Day-by-day plans with optimal routes, visit times, and real-time adjustments based on weather and crowds.",
    color: "bg-ocean/10 text-ocean",
  },
  {
    icon: Hotel,
    title: "Curated Hotels",
    description: "Hand-selected accommodations from budget-friendly to luxury, with real-time availability and best prices.",
    color: "bg-coral/10 text-coral",
  },
  {
    icon: Users,
    title: "Local Guides",
    description: "Connect with verified local experts who bring authentic experiences and hidden gems to your journey.",
    color: "bg-forest/10 text-forest",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description: "Navigate with confidence using GPS-powered maps, live traffic updates, and offline access.",
    color: "bg-gold/10 text-gold",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Stay informed with instant notifications about weather changes, delays, and nearby recommendations.",
    color: "bg-secondary/10 text-secondary",
  },
];

const Features = () => {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
            Everything You Need for the Perfect Trip
          </h2>
          <p className="text-muted-foreground mt-4">
            Our comprehensive platform combines cutting-edge AI with essential travel tools to deliver a seamless planning experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="default"
              className="group hover:-translate-y-1 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
