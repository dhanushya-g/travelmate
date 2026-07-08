import { useNavigate } from "react-router-dom";
import { MapPin, Star, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  id: string | number;
  image: string;
  name: string;
  country: string;
  rating: number;
  duration: string;
  description: string;
  className?: string;
  featured?: boolean;
}

const DestinationCard = ({
  id,
  image,
  name,
  country,
  rating,
  duration,
  description,
  className,
  featured = false,
}: DestinationCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/destination/${id}`);
  };

  return (
    <Card
      variant="image"
      onClick={handleClick}
      className={cn(
        "cursor-pointer hover:-translate-y-2 transition-all duration-500",
        featured ? "md:col-span-2 md:row-span-2" : "",
        className
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "h-[500px]" : "h-[300px]")}>
        {/* Image */}
        <img
          src={image}
          alt={`${name}, ${country}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 gradient-card opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
          <Star className="w-4 h-4 text-gold fill-gold" />
          <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-background/80">{country}</span>
          </div>
          <h3 className={cn(
            "font-display font-bold text-background mb-2",
            featured ? "text-3xl" : "text-xl"
          )}>
            {name}
          </h3>
          {featured && (
            <p className="text-background/80 text-sm mb-4 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-background/70">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DestinationCard;
