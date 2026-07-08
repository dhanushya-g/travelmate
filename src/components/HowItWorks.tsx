import { MapPin, Sparkles, Plane, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Choose Your Destination",
    description: "Select from our curated list of destinations or search for any place that inspires your wanderlust.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get AI Recommendations",
    description: "Our AI analyzes your preferences, travel style, and interests to generate personalized itineraries.",
  },
  {
    number: "03",
    icon: Plane,
    title: "Book Everything in One Place",
    description: "Reserve hotels, transportation, and local guides directly through our integrated booking system.",
  },
  {
    number: "04",
    icon: Heart,
    title: "Travel with Confidence",
    description: "Enjoy real-time updates, interactive maps, and 24/7 support throughout your journey.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
            How TravelMate Works
          </h2>
          <p className="text-muted-foreground mt-4">
            From inspiration to exploration in four simple steps. Let us handle the complexity while you focus on making memories.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              <div className="text-center">
                {/* Number Badge */}
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center transition-all duration-500 group-hover:bg-primary/10 group-hover:shadow-glow">
                    <step.icon className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
