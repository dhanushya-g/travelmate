import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Car, Bus, ExternalLink } from "lucide-react";

interface PlaceOptionsModalProps {
  placeName: string;
  destination: string;
  fromAddress?: string;
}

const PlaceOptionsModal = ({ placeName, destination, fromAddress }: PlaceOptionsModalProps) => {
  const [open, setOpen] = useState(false);

  const fullLocation = `${placeName}, ${destination}`;
  const encodedLocation = encodeURIComponent(fullLocation);
  const encodedFrom = fromAddress ? encodeURIComponent(fromAddress) : encodeURIComponent(destination);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedFrom}&destination=${encodedLocation}`;

  const transportOptions = [
    {
      name: "Google Maps",
      icon: Map,
      description: "View directions on Google Maps",
      url: googleMapsDirectionsUrl,
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
    },
    {
      name: "Ola",
      icon: Car,
      description: "Book a cab with Ola",
      url: `https://book.olacabs.com/?drop_lat=0&drop_lng=0&drop_name=${encodedLocation}`,
      color: "bg-green-500/10 text-green-600 hover:bg-green-500/20"
    },
    {
      name: "Uber",
      icon: Car,
      description: "Book a ride with Uber",
      url: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodedLocation}`,
      color: "bg-gray-800/10 text-gray-800 hover:bg-gray-800/20 dark:bg-gray-200/10 dark:text-gray-200"
    },
    {
      name: "Rapido Auto",
      icon: Car,
      description: "Book an auto with Rapido",
      url: `https://www.rapido.bike/`,
      color: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
    },
    {
      name: "Bus Routes",
      icon: Bus,
      description: "Find bus routes on Google Maps",
      url: `https://www.google.com/maps/dir/?api=1&origin=${encodedFrom}&destination=${encodedLocation}&travelmode=transit`,
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20"
    },
    {
      name: "Rome2Rio",
      icon: Bus,
      description: "Compare all transport options",
      url: `https://www.rome2rio.com/map/${encodedFrom}/${encodedLocation}`,
      color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="font-semibold text-foreground hover:text-primary hover:underline cursor-pointer transition-colors text-left">
          {placeName}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{placeName}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="maps" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="maps" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Maps
            </TabsTrigger>
            <TabsTrigger value="travel" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Travel Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="maps" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              View {placeName} on Google Maps
            </p>
            <div className="rounded-lg overflow-hidden border border-border bg-muted/30 aspect-video flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedLocation}`}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={() => window.open(googleMapsUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Google Maps
            </Button>
          </TabsContent>

          <TabsContent value="travel" className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Choose your preferred mode of transport to reach {placeName}
            </p>
            <div className="grid gap-3">
              {transportOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${option.color}`}
                >
                  <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                    <option.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{option.name}</h4>
                    <p className="text-xs opacity-80">{option.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </a>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceOptionsModal;
