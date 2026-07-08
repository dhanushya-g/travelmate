import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import { NotificationSettings } from "@/components/NotificationSettings";
import {
  MapPin,
  Calendar,
  Users,
  User,
  LogOut,
  History,
  Trash2,
  Eye,
  Plane,
  Globe,
  ArrowLeft,
  Loader2,
  Mail,
  Clock,
  Heart,
  Star,
} from "lucide-react";

interface SavedItinerary {
  id: string;
  destination: string;
  country: string | null;
  start_date: string;
  end_date: string;
  travelers: number;
  travel_styles: string[] | null;
  budget: string | null;
  itinerary_data: any;
  created_at: string;
}

interface TravelStats {
  totalTrips: number;
  countriesVisited: number;
  upcomingTrips: number;
  favoriteStyle: string;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [stats, setStats] = useState<TravelStats>({
    totalTrips: 0,
    countriesVisited: 0,
    upcomingTrips: 0,
    favoriteStyle: "Explorer",
  });
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchSavedItineraries = async (userId: string) => {
    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSavedItineraries(data as SavedItinerary[]);
      
      // Calculate stats
      const uniqueCountries = new Set(data.map(i => i.country).filter(Boolean));
      const today = new Date();
      const upcoming = data.filter(i => new Date(i.start_date) > today);
      
      // Find most common travel style
      const allStyles = data.flatMap(i => i.travel_styles || []);
      const styleCounts = allStyles.reduce((acc: Record<string, number>, style) => {
        acc[style] = (acc[style] || 0) + 1;
        return acc;
      }, {});
      const topStyle = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Explorer";
      
      setStats({
        totalTrips: data.length,
        countriesVisited: uniqueCountries.size,
        upcomingTrips: upcoming.length,
        favoriteStyle: topStyle.charAt(0).toUpperCase() + topStyle.slice(1),
      });
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
      setTimeout(() => fetchSavedItineraries(session.user.id), 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setLoading(false);
      fetchSavedItineraries(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const handleDeleteItinerary = async (id: string) => {
    const { error } = await supabase.from("itineraries").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Could not delete the itinerary.",
      });
    } else {
      toast({
        title: "Itinerary deleted",
        description: "The trip has been removed.",
      });
      setSavedItineraries((prev) => prev.filter((i) => i.id !== id));
      setStats(prev => ({ ...prev, totalTrips: prev.totalTrips - 1 }));
    }
  };

  const handleViewItinerary = (saved: SavedItinerary) => {
    navigate(`/plan?destination=${encodeURIComponent(saved.destination)}`);
  };

  const categorizeTrips = () => {
    const today = new Date();
    const upcoming: SavedItinerary[] = [];
    const past: SavedItinerary[] = [];
    
    savedItineraries.forEach(trip => {
      if (new Date(trip.end_date) < today) {
        past.push(trip);
      } else {
        upcoming.push(trip);
      }
    });
    
    return { upcoming, past };
  };

  const { upcoming, past } = categorizeTrips();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile - TravelMate</title>
        <meta name="description" content="View your saved trips, travel history, and preferences on TravelMate." />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-foreground">TravelMate</span>
              </a>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate("/plan")}>
                  <Plane className="w-4 h-4 mr-2" />
                  Plan Trip
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-6 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {/* Profile Header */}
            <Card variant="elevated" className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-display font-bold text-foreground">
                      {user?.user_metadata?.full_name || "Traveler"}
                    </h1>
                    <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      Member since {new Date(user?.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card variant="default" className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalTrips}</p>
                <p className="text-sm text-muted-foreground">Total Trips</p>
              </Card>
              <Card variant="default" className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-5 h-5 text-ocean" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.countriesVisited}</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </Card>
              <Card variant="default" className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.upcomingTrips}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </Card>
              <Card variant="default" className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-2">
                  <History className="w-5 h-5 text-coral" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.favoriteStyle}</p>
                <p className="text-sm text-muted-foreground">Travel Style</p>
              </Card>
            </div>

            {/* Trips Tabs */}
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto">
                <TabsTrigger value="upcoming" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming ({upcoming.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="w-4 h-4" />
                  History ({past.length})
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Saved ({favorites.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcoming.length === 0 ? (
                  <Card variant="default" className="p-8 text-center">
                    <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming trips</h3>
                    <p className="text-muted-foreground mb-4">Start planning your next adventure!</p>
                    <Button onClick={() => navigate("/plan")}>Plan a Trip</Button>
                  </Card>
                ) : (
                  upcoming.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onView={handleViewItinerary}
                      onDelete={handleDeleteItinerary}
                      isUpcoming
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {past.length === 0 ? (
                  <Card variant="default" className="p-8 text-center">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No travel history yet</h3>
                    <p className="text-muted-foreground">Your completed trips will appear here.</p>
                  </Card>
                ) : (
                  past.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onView={handleViewItinerary}
                      onDelete={handleDeleteItinerary}
                      isUpcoming={false}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4">
                {favorites.length === 0 ? (
                  <Card variant="default" className="p-8 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No saved favorites</h3>
                    <p className="text-muted-foreground mb-4">Save destinations and activities you love!</p>
                    <Button onClick={() => navigate("/")}>Explore Destinations</Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <Card key={fav.id} variant="default" className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex">
                            {fav.item_image ? (
                              <img
                                src={fav.item_image}
                                alt={fav.item_name}
                                className="w-24 h-24 object-cover"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-primary/10 flex items-center justify-center">
                                {fav.item_type === "destination" ? (
                                  <Globe className="w-8 h-8 text-primary/40" />
                                ) : (
                                  <Star className="w-8 h-8 text-gold/40" />
                                )}
                              </div>
                            )}
                            <div className="flex-1 p-3">
                              <Badge variant="secondary" className="text-xs capitalize mb-1">
                                {fav.item_type}
                              </Badge>
                              <h4 className="font-semibold text-foreground text-sm">{fav.item_name}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFavorite(fav.item_type as "destination" | "activity", fav.item_id)}
                                className="mt-2 h-7 text-xs text-destructive hover:text-destructive p-0"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Notification Settings */}
            <div className="mt-8">
              <NotificationSettings />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

interface TripCardProps {
  trip: SavedItinerary;
  onView: (trip: SavedItinerary) => void;
  onDelete: (id: string) => void;
  isUpcoming: boolean;
}

const TripCard = ({ trip, onView, onDelete, isUpcoming }: TripCardProps) => {
  const getDaysUntil = () => {
    const today = new Date();
    const start = new Date(trip.start_date);
    const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysUntil = getDaysUntil();

  return (
    <Card variant="default" className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Trip Image */}
          <div className="w-full sm:w-40 h-32 sm:h-auto bg-gradient-to-br from-primary/20 to-ocean/20 flex items-center justify-center">
            <Globe className="w-12 h-12 text-primary/40" />
          </div>
          
          {/* Trip Details */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  {trip.destination}
                  {trip.country && <span className="text-muted-foreground font-normal">, {trip.country}</span>}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {trip.travelers} traveler{trip.travelers !== 1 ? "s" : ""}
                  </span>
                </div>
                
                {/* Travel Styles */}
                {trip.travel_styles && trip.travel_styles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {trip.travel_styles.map((style) => (
                      <Badge key={style} variant="secondary" className="text-xs capitalize">
                        {style}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {isUpcoming && daysUntil > 0 && (
                <Badge variant="default" className="shrink-0">
                  {daysUntil} day{daysUntil !== 1 ? "s" : ""} away
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => onView(trip)}
                className="gap-1"
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(trip.id)}
                className="text-destructive hover:text-destructive gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
