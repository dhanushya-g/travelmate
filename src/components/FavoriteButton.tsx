import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  itemType: "destination" | "activity";
  itemId: string;
  itemName: string;
  itemImage?: string;
  itemData?: Record<string, string | number | boolean | null>;
  variant?: "icon" | "button";
  className?: string;
}

export const FavoriteButton = ({
  itemType,
  itemId,
  itemName,
  itemImage,
  itemData,
  variant = "icon",
  className,
}: FavoriteButtonProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const isFav = isFavorite(itemType, itemId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    if (isFav) {
      await removeFavorite(itemType, itemId);
    } else {
      await addFavorite(itemType, itemId, itemName, itemImage, itemData);
    }

    setIsLoading(false);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all",
          "bg-background/80 backdrop-blur-sm hover:bg-background",
          "border border-border/50 hover:border-border",
          className
        )}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : (
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isFav ? "fill-coral text-coral" : "text-muted-foreground hover:text-coral"
            )}
          />
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={isFav ? "secondary" : "outline"}
      size="sm"
      className={cn("gap-2", className)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={cn("w-4 h-4", isFav && "fill-current")} />
      )}
      {isFav ? "Saved" : "Save"}
    </Button>
  );
};
