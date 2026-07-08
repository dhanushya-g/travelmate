import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TravelMate - AI-Powered Travel Companion | Plan Your Perfect Trip</title>
        <meta
          name="description"
          content="Discover destinations, curated itineraries, top hotels, and local guides. TravelMate uses AI to personalize your travel planning experience."
        />
        <meta name="keywords" content="travel planning, AI travel, itinerary, hotels, local guides, vacation planner" />
        <link rel="canonical" href="https://travelmate.com" />
      </Helmet>

      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <FeaturedDestinations />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </main>
    </>
  );
};

export default Index;
