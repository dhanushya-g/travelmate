import DestinationCard from "./DestinationCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import machuPicchu from "@/assets/destination-machu-picchu.jpg";
import kyoto from "@/assets/destination-kyoto.jpg";
import amalfi from "@/assets/destination-amalfi.jpg";
import bali from "@/assets/destination-bali.jpg";

const destinations = [
  {
    id: "1",
    image: machuPicchu,
    name: "Machu Picchu",
    country: "Peru",
    rating: 4.9,
    duration: "5-7 days",
    description: "Discover the ancient Incan citadel perched high in the Andes Mountains, a UNESCO World Heritage site shrouded in mystery and breathtaking beauty.",
    featured: true,
  },
  {
    id: "2",
    image: kyoto,
    name: "Kyoto",
    country: "Japan",
    rating: 4.8,
    duration: "4-6 days",
    description: "Experience traditional Japanese culture through ancient temples, serene zen gardens, and iconic cherry blossoms.",
    featured: false,
  },
  {
    id: "3",
    image: amalfi,
    name: "Amalfi Coast",
    country: "Italy",
    rating: 4.7,
    duration: "5-7 days",
    description: "Explore stunning cliffside villages, crystal-clear waters, and world-renowned Mediterranean cuisine.",
    featured: false,
  },
  {
    id: "4",
    image: bali,
    name: "Bali",
    country: "Indonesia",
    rating: 4.8,
    duration: "7-10 days",
    description: "Immerse yourself in lush rice terraces, ancient temples, and vibrant cultural traditions.",
    featured: false,
  },
];

const FeaturedDestinations = () => {
  return (
    <section id="destinations" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Explore the World
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-2">
              Featured Destinations
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg">
              Handpicked destinations with AI-curated itineraries, verified local guides, and seamless booking experiences.
            </p>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              {...destination}
              className={index === 0 ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
