import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-sunset opacity-90" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background/10 backdrop-blur-sm mb-8 animate-float">
            <Sparkles className="w-8 h-8 text-background" />
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-background mb-6">
            Ready to Start Your Next Adventure?
          </h2>
          
          {/* Description */}
          <p className="text-xl text-background/80 mb-10 max-w-xl mx-auto">
            Join thousands of travelers who plan smarter, explore deeper, and create unforgettable memories with TravelMate.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" className="bg-background text-foreground hover:bg-background/90">
              Start Planning for Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Watch Demo
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-12 border-t border-background/20">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-background">50K+</div>
              <div className="text-sm text-background/70">Happy Travelers</div>
            </div>
            <div className="w-px h-12 bg-background/20 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-background">200+</div>
              <div className="text-sm text-background/70">Destinations</div>
            </div>
            <div className="w-px h-12 bg-background/20 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-background">4.9</div>
              <div className="text-sm text-background/70">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
