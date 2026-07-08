import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bus,
  Car,
  Train,
  Clock,
  MapPin,
  Navigation,
  ArrowRight,
} from "lucide-react";

interface TransportRoute {
  id: string;
  type: "bus" | "cab" | "metro";
  name: string;
  from: string;
  to: string;
  duration: string;
  priceINR: number;
  priceRangeINR?: [number, number];
  frequency?: string;
  distance?: string;
  stops?: number;
}

interface TransportOptionsProps {
  destination: string;
  fromAddress?: string;
  days?: any[];
}

const transportIcons = {
  bus: Bus,
  cab: Car,
  metro: Train,
};

const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatPriceRange = (range: [number, number]): string => {
  return `${formatINR(range[0])}-${formatINR(range[1])}`;
};

export const TransportOptions = ({ destination, fromAddress, days }: TransportOptionsProps) => {
  const [selectedTab, setSelectedTab] = useState("all");

  // Budget-friendly transport data in INR
  const generateRoutes = (): TransportRoute[] => {
    const locations = days?.flatMap(day => 
      day.activities?.map((a: any) => a.activity) || []
    ).slice(0, 4) || [`${destination} Airport`, `${destination} Station`, "City Center", "Old Town"];

    const routes: TransportRoute[] = [
      // Bus routes
      {
        id: "bus-1",
        type: "bus",
        name: "City Express Bus",
        from: fromAddress || "Airport",
        to: locations[0] || "City Center",
        duration: "45 min",
        priceINR: 50,
        frequency: "Every 15 min",
        stops: 8,
      },
      {
        id: "bus-2",
        type: "bus",
        name: "Tourist Shuttle",
        from: "Central Station",
        to: "Old Town",
        duration: "25 min",
        priceINR: 30,
        frequency: "Every 20 min",
        stops: 5,
      },
      // Cab routes
      {
        id: "cab-1",
        type: "cab",
        name: "Ola / Uber",
        from: fromAddress || "Your Location",
        to: locations[0] || "City Center",
        duration: "25 min",
        priceINR: 250,
        priceRangeINR: [250, 400],
        distance: "12 km",
      },
      {
        id: "cab-2",
        type: "cab",
        name: "Auto Rickshaw",
        from: fromAddress || "Your Location",
        to: locations[0] || "City Center",
        duration: "30 min",
        priceINR: 150,
        priceRangeINR: [150, 200],
        distance: "12 km",
      },
      // Metro routes
      {
        id: "metro-1",
        type: "metro",
        name: "Metro Line 1",
        from: "Central Station",
        to: "Old Town",
        duration: "15 min",
        priceINR: 25,
        frequency: "Every 5 min",
        stops: 4,
      },
      {
        id: "metro-2",
        type: "metro",
        name: "Metro Line 2",
        from: "Airport Terminal",
        to: "City Center",
        duration: "35 min",
        priceINR: 60,
        frequency: "Every 8 min",
        stops: 10,
      },
    ];

    return routes;
  };

  const routes = generateRoutes();

  const filteredRoutes = selectedTab === "all" 
    ? routes 
    : routes.filter(r => r.type === selectedTab);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "bus": return "bg-forest/10 text-forest border-forest/20";
      case "cab": return "bg-gold/10 text-gold border-gold/20";
      case "metro": return "bg-ocean/10 text-ocean border-ocean/20";
      default: return "";
    }
  };

  const getRoutePrice = (route: TransportRoute): string => {
    if (route.priceRangeINR) {
      return formatPriceRange(route.priceRangeINR);
    }
    return formatINR(route.priceINR);
  };

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Navigation className="w-5 h-5 text-ocean" />
          Transportation Options
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Getting around {destination}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="bus" className="text-xs gap-1">
              <Bus className="w-3 h-3" />
              Bus
            </TabsTrigger>
            <TabsTrigger value="cab" className="text-xs gap-1">
              <Car className="w-3 h-3" />
              Cab
            </TabsTrigger>
            <TabsTrigger value="metro" className="text-xs gap-1">
              <Train className="w-3 h-3" />
              Metro
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-3 mt-0">
            {filteredRoutes.map((route) => {
              const Icon = transportIcons[route.type];
              return (
                <div
                  key={route.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBadgeColor(route.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{route.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-20">{route.from}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="truncate max-w-20">{route.to}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getBadgeColor(route.type)}>{getRoutePrice(route)}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {route.duration}
                    </span>
                    {route.frequency && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.frequency}
                      </span>
                    )}
                    {route.stops && (
                      <span>{route.stops} stops</span>
                    )}
                    {route.distance && (
                      <span>{route.distance}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Open in Maps
            </a>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
            <a 
              href={`https://www.rome2rio.com/s/${encodeURIComponent(fromAddress || "Airport")}/${encodeURIComponent(destination)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Bus className="w-3 h-3 mr-1" />
              Compare Routes
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
