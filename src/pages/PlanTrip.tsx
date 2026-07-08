import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import LanguageSelector from "@/components/LanguageSelector";
import {
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Compass,
  Mountain,
  Palmtree,
  Building2,
  UtensilsCrossed,
  Camera,
  Sparkles,
  ArrowRight,
  LogOut,
  User,
  Plane,
  Hotel,
  Map,
  Clock,
  Loader2,
  RotateCcw,
  Save,
  History,
  Trash2,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const travelStyles = [
  { id: "adventure", label: "Adventure", icon: Mountain, color: "bg-forest/10 text-forest" },
  { id: "relaxation", label: "Relaxation", icon: Palmtree, color: "bg-ocean/10 text-ocean" },
  { id: "cultural", label: "Cultural", icon: Building2, color: "bg-coral/10 text-coral" },
  { id: "culinary", label: "Culinary", icon: UtensilsCrossed, color: "bg-gold/10 text-gold" },
  { id: "photography", label: "Photography", icon: Camera, color: "bg-primary/10 text-primary" },
];

const budgetOptions = [
  { id: "budget", label: "Budget", range: "₹0-2,000/day" },
  { id: "moderate", label: "Moderate", range: "₹2,000-5,000/day" },
  { id: "luxury", label: "Luxury", range: "₹5,000+/day" },
];

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

const PlanTrip = () => {
  const [searchParams] = useSearchParams();
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [fromAddress, setFromAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("moderate");
  const [budgetPerPerson, setBudgetPerPerson] = useState<number>(10000);
  const [preferredLanguage, setPreferredLanguage] = useState<string>("en");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [showSaved, setShowSaved] = useState(false);
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
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => fetchSavedItineraries(session.user.id), 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchSavedItineraries(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSavedItineraries([]);
    toast({
      title: "Signed out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const handleSaveItinerary = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in to save your itinerary.",
      });
      navigate("/auth");
      return;
    }

    if (!itinerary || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please ensure dates are set before saving.",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("itineraries").insert({
        user_id: user.id,
        destination: itinerary.destination || destination,
        country: itinerary.country || null,
        start_date: startDate,
        end_date: endDate,
        travelers: parseInt(travelers),
        travel_styles: selectedStyles,
        budget: selectedBudget,
        itinerary_data: itinerary,
      });

      if (error) throw error;

      toast({
        title: "Itinerary saved!",
        description: "Your trip has been saved to your profile.",
      });
      fetchSavedItineraries(user.id);
    } catch (error: any) {
      console.error("Error saving itinerary:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Please try again.",
      });
    } finally {
      setSaving(false);
    }
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
    }
  };

  const handleViewSavedItinerary = (saved: SavedItinerary) => {
    setItinerary(saved.itinerary_data);
    setDestination(saved.destination);
    setStartDate(saved.start_date);
    setEndDate(saved.end_date);
    setTravelers(saved.travelers.toString());
    setSelectedStyles(saved.travel_styles || []);
    setSelectedBudget(saved.budget || "moderate");
    setShowSaved(false);
  };

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((s) => s !== styleId)
        : [...prev, styleId]
    );
  };

  const handleGenerateItinerary = async () => {
    if (!destination) {
      toast({
        variant: "destructive",
        title: "Destination required",
        description: "Please enter a destination to continue.",
      });
      return;
    }

    setGenerating(true);
    setItinerary(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          destination,
          fromAddress,
          startDate,
          endDate,
          travelers,
          styles: selectedStyles,
          budget: selectedBudget,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate itinerary");
      }

      setItinerary(data.itinerary);
      toast({
        title: "Itinerary ready!",
        description: `Your personalized ${destination} trip is ready to explore.`,
      });
    } catch (error: any) {
      console.error("Error generating itinerary:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Please try again later.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleNewItinerary = () => {
    setItinerary(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Plan Your Trip - TravelMate</title>
        <meta name="description" content="Create your personalized travel itinerary with AI-powered recommendations for destinations, hotels, and activities." />
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
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
                      <User className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">{user.email}</span>
                      <span className="sm:hidden">Profile</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="default" size="sm" onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Planning</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Plan Your Perfect Trip
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Tell us about your dream destination and preferences, and we'll create a personalized itinerary just for you.
              </p>
            </div>

            {/* Tabs for Plan / Saved */}
            {user && savedItineraries.length > 0 && (
              <div className="flex justify-center gap-2 mb-8">
                <Button
                  variant={showSaved ? "outline" : "default"}
                  onClick={() => setShowSaved(false)}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Plan Trip
                </Button>
                <Button
                  variant={showSaved ? "default" : "outline"}
                  onClick={() => setShowSaved(true)}
                  className="gap-2"
                >
                  <History className="w-4 h-4" />
                  My Trips ({savedItineraries.length})
                </Button>
              </div>
            )}

            {/* Show Saved Itineraries */}
            {showSaved ? (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  Your Saved Trips
                </h2>
                {savedItineraries.map((saved) => (
                  <Card key={saved.id} className="p-4">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg">
                            {saved.destination}
                            {saved.country && <span className="text-muted-foreground font-normal">, {saved.country}</span>}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(saved.start_date).toLocaleDateString()} - {new Date(saved.end_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {saved.travelers} traveler{saved.travelers !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewSavedItinerary(saved)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItinerary(saved.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : itinerary ? (
              <div className="space-y-6">
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={handleNewItinerary} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Plan Another Trip
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleSaveItinerary}
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Trip
                  </Button>
                </div>
                <ItineraryDisplay 
                  itinerary={itinerary} 
                  startDate={startDate}
                  endDate={endDate}
                  fromAddress={fromAddress}
                  travelers={parseInt(travelers)}
                  budgetPerPerson={budgetPerPerson}
                />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Destination & Dates */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Compass className="w-5 h-5 text-primary" />
                      Where & When
                    </CardTitle>
                    <CardDescription>Choose your destination and travel dates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromAddress">From (Starting Point)</Label>
                        <div className="relative">
                          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="fromAddress"
                            placeholder="Your city or address..."
                            value={fromAddress}
                            onChange={(e) => setFromAddress(e.target.value)}
                            className="pl-11 h-12 text-base"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="destination"
                            placeholder="Where do you want to go?"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="pl-11 h-12 text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="pl-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                          <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="pl-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="travelers">Travelers</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="travelers"
                            type="number"
                            min="1"
                            max="20"
                            value={travelers}
                            onChange={(e) => setTravelers(e.target.value)}
                            className="pl-11"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Style */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Plane className="w-5 h-5 text-primary" />
                      Travel Style
                    </CardTitle>
                    <CardDescription>What kind of experience are you looking for?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {travelStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => toggleStyle(style.id)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300",
                            selectedStyles.includes(style.id)
                              ? "border-primary bg-primary/5 shadow-soft"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", style.color)}>
                            <style.icon className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Per Person */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <IndianRupee className="w-5 h-5 text-primary" />
                      Budget Per Person
                    </CardTitle>
                    <CardDescription>Set your total budget per person for the entire trip (hotels)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1 max-w-xs">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="number"
                          value={budgetPerPerson}
                          onChange={(e) => setBudgetPerPerson(Math.max(1000, parseInt(e.target.value) || 1000))}
                          className="pl-11 h-12 text-lg font-semibold"
                          min={1000}
                          step={1000}
                        />
                      </div>
                      <span className="text-muted-foreground text-sm">per person (whole trip)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[5000, 10000, 20000].map((amount) => (
                        <Button
                          key={amount}
                          variant={budgetPerPerson === amount ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBudgetPerPerson(amount)}
                        >
                          ₹{amount.toLocaleString("en-IN")}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Budget Style Selection */}
                    <div className="pt-4 border-t border-border">
                      <Label className="text-sm font-medium mb-3 block">Overall Trip Style</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {budgetOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedBudget(option.id)}
                            className={cn(
                              "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300",
                              selectedBudget === option.id
                                ? "border-primary bg-primary/5 shadow-soft"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            )}
                          >
                            <span className="font-semibold text-foreground">{option.label}</span>
                            <span className="text-xs text-muted-foreground">{option.range}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Language Preference */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="text-primary">🌐</span>
                      Language Preference
                    </CardTitle>
                    <CardDescription>Select your preferred language for the trip</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LanguageSelector 
                      value={preferredLanguage} 
                      onChange={setPreferredLanguage} 
                    />
                  </CardContent>
                </Card>

                {/* Generate Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="hero" 
                    size="xl" 
                    onClick={handleGenerateItinerary} 
                    className="min-w-[280px]"
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate My Itinerary
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* What You'll Get */}
            <div className="mt-16">
              <h2 className="text-xl font-display font-semibold text-foreground text-center mb-8">
                What You'll Get
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Calendar, label: "Day-by-Day Itinerary" },
                  { icon: Hotel, label: "Hotel Recommendations" },
                  { icon: Map, label: "Interactive Maps" },
                  { icon: Clock, label: "Optimal Visit Times" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-background border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PlanTrip;
