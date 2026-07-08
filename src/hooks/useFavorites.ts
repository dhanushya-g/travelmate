import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Favorite {
  id: string;
  item_type: string;
  item_id: string;
  item_name: string;
  item_image: string | null;
  item_data: unknown;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      if (user) {
        fetchFavorites(user.id);
      } else {
        setLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
      if (session?.user) {
        fetchFavorites(session.user.id);
      } else {
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchFavorites = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (
    itemType: "destination" | "activity",
    itemId: string,
    itemName: string,
    itemImage?: string,
    itemData?: Record<string, string | number | boolean | null>
  ) => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase.from("favorites").insert([{
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        item_name: itemName,
        item_image: itemImage || null,
        item_data: itemData || null,
      }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already saved",
            description: `${itemName} is already in your favorites.`,
          });
          return false;
        }
        throw error;
      }

      await fetchFavorites(userId);
      toast({
        title: "Added to favorites",
        description: `${itemName} has been saved to your favorites.`,
      });
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);
      toast({
        title: "Error",
        description: "Failed to add to favorites.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeFavorite = async (itemType: "destination" | "activity", itemId: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("item_type", itemType)
        .eq("item_id", itemId);

      if (error) throw error;

      await fetchFavorites(userId);
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites.",
      });
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites.",
        variant: "destructive",
      });
      return false;
    }
  };

  const isFavorite = (itemType: "destination" | "activity", itemId: string) => {
    return favorites.some((f) => f.item_type === itemType && f.item_id === itemId);
  };

  return {
    favorites,
    loading,
    userId,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};
