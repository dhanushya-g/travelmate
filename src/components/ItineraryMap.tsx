import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  time: string;
  activity: string;
  description: string;
  coordinates?: { lat: number; lng: number };
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

interface ItineraryMapProps {
  destination: string;
  days: DayPlan[];
  mapboxToken?: string;
  onTokenSubmit?: (token: string) => void;
}

export const ItineraryMap = ({ destination, days, mapboxToken, onTokenSubmit }: ItineraryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [token, setToken] = useState(mapboxToken || "");
  const [hasToken, setHasToken] = useState(!!mapboxToken);
  const [selectedDay, setSelectedDay] = useState(1);
  const [mapError, setMapError] = useState<string | null>(null);

  const handleTokenSubmit = () => {
    if (token.trim()) {
      setHasToken(true);
      onTokenSubmit?.(token.trim());
    }
  };

  useEffect(() => {
    if (!hasToken || !mapContainer.current || map.current) return;

    const initMap = async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        await import("mapbox-gl/dist/mapbox-gl.css");

        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [0, 20],
          zoom: 2,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Geocode the destination
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${token}`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          map.current.flyTo({
            center: [lng, lat],
            zoom: 12,
            duration: 2000,
          });

          // Add destination marker
          new mapboxgl.Marker({ color: "#2563eb" })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${destination}</strong>`))
            .addTo(map.current);
        }
      } catch (error) {
        console.error("Map initialization error:", error);
        setMapError("Failed to load map. Please check your Mapbox token.");
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [hasToken, token, destination]);

  if (!hasToken) {
    return (
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Interactive Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-xl p-6 text-center">
            <Navigation className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Enable Interactive Map</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Enter your Mapbox public token to view an interactive map with your itinerary locations.
              Get your free token at{" "}
              <a 
                href="https://mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                placeholder="pk.eyJ1Ijo..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTokenSubmit} disabled={!token.trim()}>
                Enable Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (mapError) {
    return (
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Interactive Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Map Error</h3>
            <p className="text-sm text-muted-foreground mb-4">{mapError}</p>
            <Button 
              variant="outline" 
              onClick={() => { 
                setHasToken(false); 
                setMapError(null);
                setToken("");
              }}
            >
              Try Different Token
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="default" className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Interactive Map
          </span>
          <div className="flex gap-1">
            {days.map((day) => (
              <Button
                key={day.day}
                variant={selectedDay === day.day ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedDay(day.day)}
                className="w-8 h-8 p-0"
              >
                {day.day}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="w-full h-[400px] bg-muted" />
        <div className="p-4 bg-muted/30 border-t border-border">
          <h4 className="font-medium text-sm text-foreground mb-2">
            Day {selectedDay}: {days[selectedDay - 1]?.title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {days[selectedDay - 1]?.activities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-xs text-primary"
              >
                <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                {activity.activity}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
