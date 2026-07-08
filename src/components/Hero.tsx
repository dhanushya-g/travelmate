import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-santorini.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Santorini sunset overlooking the Aegean Sea"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-foreground/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-background">AI-Powered Travel Planning</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-background mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Your Journey,{" "}
            <span className="text-gradient">Perfectly Planned</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-background/80 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Discover destinations, curated itineraries, top hotels, and local guides — all powered by intelligent recommendations tailored to your style.
          </p>

          {/* Search Box */}
          <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-elevated p-3 sm:p-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-col md:flex-row gap-3">
              {/* Destination Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
                />
              </div>

              {/* Date Input */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors md:w-48">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground font-medium">Any dates</span>
              </div>

              {/* Travelers Input */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors md:w-40">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground font-medium">2 guests</span>
              </div>

              {/* Search Button */}
              <Button variant="hero" size="lg" className="w-full md:w-auto">
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Explore</span>
              </Button>
            </div>
          </div>

          {/* Popular Destinations Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <span className="text-sm text-background/60">Popular:</span>
            {["Santorini", "Kyoto", "Bali", "Machu Picchu", "Amalfi"].map((dest) => (
              <button
                key={dest}
                className="px-3 py-1.5 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 text-sm text-background hover:bg-background/20 transition-colors"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-background/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-background/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
