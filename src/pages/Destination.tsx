import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Clock,
  ArrowLeft,
  Sparkles,
  Calendar,
  Users,
  Camera,
  Utensils,
  Mountain,
  Building2,
} from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import HistoryModal from "@/components/HistoryModal";

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
    fullDescription: "Machu Picchu, the 'Lost City of the Incas', stands as one of the most remarkable archaeological achievements in human history. Built in the 15th century and later abandoned, this ancient city was hidden from the outside world until its rediscovery in 1911. Perched at nearly 8,000 feet in the Andes Mountains, the site offers breathtaking views and an unparalleled connection to Incan civilization.",
    highlights: [
      "Explore the ancient ruins and learn about Incan history",
      "Hike the legendary Inca Trail",
      "Visit the Sacred Valley and local villages",
      "Experience authentic Peruvian cuisine",
      "Witness sunrise over the mountain peaks",
    ],
    bestTime: "April to October (dry season)",
    climate: "Mild, with temperatures between 50-68°F",
    language: "Spanish, Quechua",
    currency: "Peruvian Sol (PEN)",
    history: {
      title: "The Lost City of the Incas",
      timeline: "Built c. 1450 AD",
      overview: "Machu Picchu was built around 1450 AD during the height of the Inca Empire under Emperor Pachacuti. It served as a royal estate and sacred religious site. The city was abandoned just over 100 years later during the Spanish Conquest and remained unknown to the outside world until American historian Hiram Bingham brought it to international attention in 1911.",
      keyEvents: [
        { year: "1438", event: "Pachacuti becomes the 9th Sapa Inca and begins expanding the empire" },
        { year: "1450", event: "Construction of Machu Picchu begins as a royal estate" },
        { year: "1533", event: "Spanish conquest reaches Peru; city is abandoned" },
        { year: "1911", event: "Hiram Bingham III rediscovers the site with local guides" },
        { year: "1983", event: "UNESCO declares Machu Picchu a World Heritage Site" },
        { year: "2007", event: "Named one of the New Seven Wonders of the World" },
      ],
      culturalSignificance: "Machu Picchu represents the pinnacle of Inca engineering and architecture. Its precise dry-stone walls, terraced agriculture, and sophisticated water management systems showcase advanced understanding of astronomy, hydrology, and construction. The site holds deep spiritual significance, with the Intihuatana stone serving as an astronomical clock and sacred object tied to the sun god Inti.",
      images: [
        { url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800", caption: "Ancient terraces at sunrise" },
        { url: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800", caption: "The iconic citadel view" },
      ],
    },
  },
  {
    id: "2",
    image: kyoto,
    name: "Kyoto",
    country: "Japan",
    rating: 4.8,
    duration: "4-6 days",
    description: "Experience traditional Japanese culture through ancient temples, serene zen gardens, and iconic cherry blossoms.",
    fullDescription: "Kyoto, Japan's former imperial capital, is a living museum of Japanese culture and history. With over 2,000 temples and shrines, traditional wooden houses, and exquisite gardens, the city offers an authentic glimpse into Japan's rich heritage. From the golden Kinkaku-ji to the thousands of vermillion torii gates at Fushimi Inari, every corner reveals new wonders.",
    highlights: [
      "Visit iconic temples like Kinkaku-ji and Fushimi Inari",
      "Stroll through the historic Gion geisha district",
      "Experience a traditional tea ceremony",
      "Explore beautiful bamboo groves in Arashiyama",
      "Taste authentic Kyoto cuisine and kaiseki dining",
    ],
    bestTime: "March to May (cherry blossoms) or October to November (autumn foliage)",
    climate: "Four distinct seasons, humid summers and cold winters",
    language: "Japanese",
    currency: "Japanese Yen (JPY)",
    history: {
      title: "The Imperial Capital of Japan",
      timeline: "Founded 794 AD",
      overview: "Kyoto served as Japan's capital and the emperor's residence from 794 until 1868. Originally called Heian-kyō ('Capital of Peace'), the city was modeled after the Chinese Tang dynasty capital Chang'an. For over a millennium, Kyoto was the center of Japanese politics, culture, and religion, giving birth to many traditions that define Japanese culture today.",
      keyEvents: [
        { year: "794", event: "Emperor Kanmu establishes Heian-kyō as the new capital" },
        { year: "1180-1185", event: "Genpei War leads to establishment of military government" },
        { year: "1397", event: "Kinkaku-ji (Golden Pavilion) is constructed" },
        { year: "1467-1477", event: "Ōnin War devastates much of the city" },
        { year: "1603", event: "Tokugawa shogunate begins; political power shifts to Edo (Tokyo)" },
        { year: "1868", event: "Meiji Restoration moves capital to Tokyo" },
        { year: "1994", event: "Historic Monuments of Ancient Kyoto designated UNESCO World Heritage Site" },
      ],
      culturalSignificance: "Kyoto is the spiritual heart of Japan, home to 17 UNESCO World Heritage sites including temples, shrines, and gardens. The city preserved many traditions including the tea ceremony, ikebana (flower arranging), and Noh theater. The geisha districts of Gion and Pontochō maintain centuries-old entertainment traditions. Kyoto's craftsmen continue ancient arts of silk weaving, pottery, and sake brewing.",
      images: [
        { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", caption: "Fushimi Inari Shrine gates" },
        { url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800", caption: "Traditional Gion district" },
      ],
    },
  },
  {
    id: "3",
    image: amalfi,
    name: "Amalfi Coast",
    country: "Italy",
    rating: 4.7,
    duration: "5-7 days",
    description: "Explore stunning cliffside villages, crystal-clear waters, and world-renowned Mediterranean cuisine.",
    fullDescription: "The Amalfi Coast stretches along the southern edge of Italy's Sorrentine Peninsula, offering some of the most dramatic coastal scenery in the world. Pastel-colored villages cling to steep cliffs above the turquoise Mediterranean Sea, connected by winding roads that reveal breathtaking vistas at every turn. A UNESCO World Heritage site, this destination combines natural beauty with rich Italian culture.",
    highlights: [
      "Visit the charming towns of Positano, Amalfi, and Ravello",
      "Swim in crystal-clear Mediterranean waters",
      "Sample fresh limoncello and local seafood",
      "Explore ancient Roman ruins at Pompeii",
      "Take a boat trip to the island of Capri",
    ],
    bestTime: "May to June or September to October",
    climate: "Mediterranean, with warm summers and mild winters",
    language: "Italian",
    currency: "Euro (EUR)",
    history: {
      title: "Maritime Republic of Amalfi",
      timeline: "Founded 4th century AD",
      overview: "The town of Amalfi was founded in the 4th century AD by Romans and became one of the four great Maritime Republics of Italy alongside Venice, Genoa, and Pisa. From the 9th to 11th centuries, Amalfi was a major Mediterranean trading power, with merchants reaching as far as Egypt and Constantinople. The Amalfi Tables, a maritime code created here, governed Mediterranean trade for centuries.",
      keyEvents: [
        { year: "339", event: "Romans found Amalfi, escaping barbarian invasions" },
        { year: "839", event: "Amalfi becomes an independent republic" },
        { year: "958", event: "First recorded version of the Tabula Amalphitana (maritime law)" },
        { year: "1073", event: "Norman conquest ends independence, though trade continues" },
        { year: "1343", event: "Major tsunami and earthquake devastate the coast" },
        { year: "1997", event: "UNESCO designates Amalfi Coast as World Heritage Site" },
      ],
      culturalSignificance: "The Amalfi Coast represents the pinnacle of Mediterranean maritime culture. The Cathedral of Amalfi, with its Arab-Norman architecture, reflects centuries of cultural exchange. Local traditions include handmade paper-making introduced from Arab traders, limoncello production from the region's famous lemons, and ceramic craftsmanship. The dramatic terraced landscapes represent centuries of human adaptation to challenging terrain.",
      images: [
        { url: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800", caption: "Colorful Positano village" },
        { url: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800", caption: "Historic Amalfi Cathedral" },
      ],
    },
  },
  {
    id: "4",
    image: bali,
    name: "Bali",
    country: "Indonesia",
    rating: 4.8,
    duration: "7-10 days",
    description: "Immerse yourself in lush rice terraces, ancient temples, and vibrant cultural traditions.",
    fullDescription: "Bali, the 'Island of the Gods', captivates visitors with its diverse landscapes, spiritual atmosphere, and warm hospitality. From the artistic center of Ubud to the beach resorts of Seminyak and the dramatic cliffs of Uluwatu, Bali offers something for every traveler. Ancient Hindu temples, terraced rice paddies, and vibrant ceremonies create an enchanting cultural tapestry.",
    highlights: [
      "Watch sunrise from Mount Batur volcano",
      "Explore the ancient temples of Uluwatu and Tanah Lot",
      "Walk through Tegallalang rice terraces",
      "Experience traditional Balinese dance performances",
      "Relax with world-class spa treatments",
    ],
    bestTime: "April to October (dry season)",
    climate: "Tropical, warm year-round with wet and dry seasons",
    language: "Indonesian, Balinese",
    currency: "Indonesian Rupiah (IDR)",
    history: {
      title: "Island of the Gods",
      timeline: "Settled c. 2000 BCE",
      overview: "Bali has been inhabited for at least 4,000 years, with evidence of early Austronesian settlers. Hinduism arrived from India around the 1st century AD, blending with indigenous animist beliefs to create Bali's unique spiritual culture. While the rest of Indonesia converted to Islam, Bali remained Hindu, becoming a refuge for Javanese Hindu nobles and artists after the fall of the Majapahit Empire in the 16th century.",
      keyEvents: [
        { year: "2000 BCE", event: "First Austronesian settlers arrive in Bali" },
        { year: "1st century", event: "Indian traders bring Hinduism and Buddhism" },
        { year: "914", event: "First written records mention Balinese kingdoms" },
        { year: "1343", event: "Majapahit Empire from Java conquers Bali" },
        { year: "1520", event: "Javanese Hindu refugees strengthen Balinese culture after Majapahit falls" },
        { year: "1906-1908", event: "Dutch colonial forces conquer Bali; puputan (mass ritual suicide) occurs" },
        { year: "1945", event: "Indonesian independence; Bali becomes a province" },
      ],
      culturalSignificance: "Bali's unique Hindu-Animist culture sets it apart in predominantly Muslim Indonesia. The concept of Tri Hita Karana (three causes of well-being) governs Balinese life: harmony with God, nature, and other humans. This philosophy manifests in daily offerings (canang sari), elaborate temple ceremonies, and the famous rice terraces created through the subak irrigation system, a UNESCO-recognized cultural landscape.",
      images: [
        { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", caption: "Ancient Tanah Lot temple at sunset" },
        { url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800", caption: "Traditional Balinese ceremony" },
      ],
    },
  },
];

const Destination = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Destination not found</h1>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const handlePlanTrip = () => {
    navigate(`/plan?destination=${encodeURIComponent(destination.name)}`);
  };

  return (
    <>
      <Helmet>
        <title>{destination.name}, {destination.country} - TravelMate</title>
        <meta name="description" content={destination.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[60vh] lg:h-[70vh]">
          <img
            src={destination.image}
            alt={`${destination.name}, ${destination.country}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Favorite Button */}
          <div className="absolute top-6 right-6">
            <FavoriteButton
              itemType="destination"
              itemId={destination.id}
              itemName={destination.name}
              itemImage={destination.image}
              itemData={{ country: destination.country, rating: destination.rating }}
            />
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="container mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">{destination.country}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
                {destination.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  <span className="font-semibold text-foreground">{destination.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{destination.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{destination.bestTime}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="hero" size="lg" onClick={handlePlanTrip}>
                  <Sparkles className="w-5 h-5" />
                  Plan Your Trip
                </Button>
                {destination.history && (
                  <HistoryModal 
                    destinationName={destination.name} 
                    history={destination.history} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  About {destination.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {destination.fullDescription}
                </p>
              </section>

              {/* Highlights */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Highlights
                </h2>
                <ul className="space-y-3">
                  {destination.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Quick Facts */}
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Quick Facts
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-ocean" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Best Time</p>
                          <p className="font-medium text-foreground text-sm">{destination.bestTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="p-4">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center">
                          <Mountain className="w-5 h-5 text-forest" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Climate</p>
                          <p className="font-medium text-foreground text-sm">{destination.climate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="p-4">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-coral" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Language</p>
                          <p className="font-medium text-foreground text-sm">{destination.language}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="p-4">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Currency</p>
                          <p className="font-medium text-foreground text-sm">{destination.currency}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-6">
                <CardContent className="p-0 space-y-6">
                  <div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                      Ready to explore?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Let our AI create a personalized itinerary for your trip to {destination.name}.
                    </p>
                    <Button variant="hero" className="w-full" onClick={handlePlanTrip}>
                      <Sparkles className="w-4 h-4" />
                      Start Planning
                    </Button>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h4 className="font-semibold text-foreground mb-3">What's included:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Day-by-day itinerary
                      </li>
                      <li className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Hotel recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-primary" />
                        Restaurant suggestions
                      </li>
                      <li className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-primary" />
                        Activity planning
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Destination;