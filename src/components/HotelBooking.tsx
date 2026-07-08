import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Hotel, 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell,
  Navigation,
  Filter,
  IndianRupee
} from "lucide-react";

interface HotelOption {
  id: string;
  name: string;
  rating: number;
  pricePerNightINR: number;
  image: string;
  location: string;
  amenities: string[];
  availability: boolean;
  category: "budget" | "mid-range" | "luxury";
}

interface HotelBookingProps {
  destination: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  budgetPerPerson?: number;
}

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  parking: Car,
  breakfast: Coffee,
  gym: Dumbbell,
};

const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const HotelBooking = ({ destination, startDate, endDate, travelers = 2, budgetPerPerson = 10000 }: HotelBookingProps) => {
  // Budget-friendly mock hotel data in INR
  const hotels: HotelOption[] = [
    {
      id: "1",
      name: `${destination} Backpacker Hostel`,
      rating: 4.0,
      pricePerNightINR: 500,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
      location: `Near Station, ${destination}`,
      amenities: ["wifi"],
      availability: true,
      category: "budget",
    },
    {
      id: "2",
      name: `${destination} Budget Stay`,
      rating: 4.1,
      pricePerNightINR: 800,
      image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
      location: `Old Town, ${destination}`,
      amenities: ["wifi"],
      availability: true,
      category: "budget",
    },
    {
      id: "3",
      name: `${destination} Guest House`,
      rating: 4.2,
      pricePerNightINR: 1200,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      location: `Central ${destination}`,
      amenities: ["wifi", "breakfast"],
      availability: true,
      category: "budget",
    },
    {
      id: "4",
      name: `${destination} Economy Inn`,
      rating: 4.3,
      pricePerNightINR: 1500,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
      location: `Market Area, ${destination}`,
      amenities: ["wifi", "parking"],
      availability: true,
      category: "budget",
    },
    {
      id: "5",
      name: `${destination} Comfort Lodge`,
      rating: 4.4,
      pricePerNightINR: 2000,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
      location: `City Center, ${destination}`,
      amenities: ["wifi", "breakfast", "parking"],
      availability: true,
      category: "mid-range",
    },
    {
      id: "6",
      name: `${destination} Business Hotel`,
      rating: 4.5,
      pricePerNightINR: 3000,
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
      location: `Business District, ${destination}`,
      amenities: ["wifi", "breakfast", "parking", "gym"],
      availability: true,
      category: "mid-range",
    },
    {
      id: "7",
      name: `${destination} Premium Suites`,
      rating: 4.7,
      pricePerNightINR: 5000,
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
      location: `Lakeside, ${destination}`,
      amenities: ["wifi", "breakfast", "parking", "gym"],
      availability: true,
      category: "luxury",
    },
  ];

  const calculateNights = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  // Total budget for the whole trip (budgetPerPerson is now total per person for the trip)
  const totalBudget = budgetPerPerson * travelers;

  // Filter hotels where total stay cost is within budget
  const filteredHotels = hotels.filter(
    (hotel) => hotel.pricePerNightINR * nights <= totalBudget
  );

  const handleViewOnMaps = (hotel: HotelOption) => {
    const query = encodeURIComponent(`${hotel.name} ${hotel.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "budget": return "bg-green-500/20 text-green-600 border-green-500/30";
      case "mid-range": return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "luxury": return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      default: return "";
    }
  };

  return (
    <Card variant="default" className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Hotel className="w-5 h-5 text-primary" />
          Budget-Friendly Hotels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget summary */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Your Budget</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatINR(budgetPerPerson)} × {travelers} person{travelers > 1 ? "s" : ""} = <strong className="text-foreground">{formatINR(totalBudget)}</strong> total
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {nights} night{nights > 1 ? "s" : ""} stay
          </p>
        </div>

        {/* Filter info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Showing {filteredHotels.length} hotel{filteredHotels.length !== 1 ? "s" : ""} within budget</span>
        </div>

        {filteredHotels.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hotels found within your budget.</p>
            <p className="text-sm mt-1">Try increasing your budget per person.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors overflow-hidden"
              >
                <div className="w-full sm:w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground text-sm truncate">{hotel.name}</h4>
                        <Badge className={`text-xs capitalize flex-shrink-0 ${getCategoryColor(hotel.category)}`}>
                          {hotel.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{hotel.location}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-gold flex-shrink-0">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hotel.amenities.slice(0, 3).map((amenity) => {
                      const Icon = amenityIcons[amenity] || Wifi;
                      return (
                        <Badge key={amenity} variant="secondary" className="text-xs gap-1 px-1.5 py-0">
                          <Icon className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">{amenity}</span>
                        </Badge>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-foreground">
                        {formatINR(hotel.pricePerNightINR)}
                      </span>
                      <span className="text-xs text-muted-foreground">/night</span>
                      <p className="text-xs text-muted-foreground truncate">
                        Total: {formatINR(hotel.pricePerNightINR * nights)}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOnMaps(hotel)}
                      className="gap-1 flex-shrink-0 text-xs px-2"
                    >
                      <Navigation className="w-3 h-3" />
                      <span className="hidden sm:inline">Maps</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center pt-2">
          Prices in ₹ (INR). Click to view location on Google Maps.
        </p>
      </CardContent>
    </Card>
  );
};
