import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Lightbulb, 
  UtensilsCrossed, 
  Hotel, 
  Luggage,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialShare } from "./SocialShare";
import { ItineraryPdfExport } from "./ItineraryPdfExport";
import { RushTimeAlerts } from "./RushTimeAlerts";
import { HotelBooking } from "./HotelBooking";
import { TransportOptions } from "./TransportOptions";
import { FavoriteButton } from "./FavoriteButton";
import PlaceHistoryModal from "./PlaceHistoryModal";
import PlaceOptionsModal from "./PlaceOptionsModal";

interface Activity {
  time: string;
  activity: string;
  description: string;
  duration: string;
  cost: string;
  tips: string;
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  hotel: string;
}

interface Itinerary {
  destination: string;
  country?: string;
  summary: string;
  days: DayPlan[];
  totalEstimatedCost: string;
  packingTips: string[];
  localTips: string[];
}

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  startDate?: string;
  endDate?: string;
  fromAddress?: string;
  travelers?: number;
  budgetPerPerson?: number;
}


export const ItineraryDisplay = ({ itinerary, startDate, endDate, fromAddress, travelers = 2, budgetPerPerson = 10000 }: ItineraryDisplayProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Actions */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Your {itinerary.destination} Adventure
          </h2>
          <FavoriteButton
            itemType="destination"
            itemId={itinerary.destination.toLowerCase().replace(/\s+/g, "-")}
            itemName={itinerary.destination}
            itemData={{ country: itinerary.country || "" }}
          />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">{itinerary.summary}</p>
        
        {fromAddress && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              From: {fromAddress}
            </Badge>
          </div>
        )}

        {/* Share Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <SocialShare itinerary={itinerary} />
          <ItineraryPdfExport 
            itinerary={itinerary} 
            startDate={startDate} 
            endDate={endDate} 
          />
        </div>
      </div>

      {/* Rush Time Alerts */}
      <RushTimeAlerts 
        destination={itinerary.destination} 
        days={itinerary.days}
        startDate={startDate}
      />

      {/* Hotel & Transport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HotelBooking 
          destination={itinerary.destination}
          startDate={startDate}
          endDate={endDate}
          travelers={travelers}
          budgetPerPerson={budgetPerPerson}
        />
        <TransportOptions 
          destination={itinerary.destination}
          fromAddress={fromAddress}
          days={itinerary.days}
        />
      </div>

      {/* Day-by-Day Itinerary */}
      <div className="space-y-6">
        {itinerary.days.map((day, index) => (
          <Card key={day.day} variant="default" className="overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {day.day}
                </div>
                <div>
                  <span className="text-lg font-display">{day.title}</span>
                  <p className="text-sm font-normal text-muted-foreground flex items-center gap-1 mt-1">
                    <Hotel className="w-3 h-3" />
                    {day.hotel}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Activities */}
              <div className="space-y-4 mb-6">
                {day.activities.map((activity, actIndex) => (
                  <div 
                    key={actIndex} 
                    className={cn(
                      "relative pl-8 pb-4",
                      actIndex !== day.activities.length - 1 && "border-l-2 border-border ml-3"
                    )}
                  >
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-ocean/10 flex items-center justify-center -translate-x-1/2">
                      <Clock className="w-3 h-3 text-ocean" />
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4 ml-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {activity.time}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {activity.duration}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <PlaceOptionsModal 
                          placeName={activity.activity} 
                          destination={itinerary.destination}
                          fromAddress={fromAddress}
                        />
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <PlaceHistoryModal 
                            placeName={activity.activity} 
                            destination={itinerary.destination} 
                          />
                          <FavoriteButton
                            itemType="activity"
                            itemId={`${itinerary.destination}-${day.day}-${actIndex}`}
                            itemName={activity.activity}
                            itemData={{ 
                              destination: itinerary.destination, 
                              day: day.day,
                              time: activity.time,
                              cost: activity.cost 
                            }}
                            variant="icon"
                            className="w-7 h-7"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                      {activity.tips && (
                        <div className="flex items-start gap-2 text-xs text-ocean bg-ocean/5 rounded-lg p-2">
                          <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{activity.tips}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Meals */}
              <div className="bg-coral/5 rounded-xl p-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="w-4 h-4 text-coral" />
                  Dining Recommendations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(day.meals).map(([meal, restaurant]) => (
                    <div key={meal} className="bg-background rounded-lg p-3">
                      <span className="text-xs font-medium text-muted-foreground uppercase">{meal}</span>
                      <p className="text-sm text-foreground mt-1">{restaurant}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Packing Tips */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Luggage className="w-5 h-5 text-primary" />
              Packing Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itinerary.packingTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Local Tips */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="w-5 h-5 text-ocean" />
              Local Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itinerary.localTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-ocean mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
