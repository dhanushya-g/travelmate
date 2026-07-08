import { Button } from "@/components/ui/button";
import { Currency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";

interface CurrencyToggleProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  className?: string;
}

export const CurrencyToggle = ({ currency, onCurrencyChange, className }: CurrencyToggleProps) => {
  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-lg bg-muted", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCurrencyChange("USD")}
        className={cn(
          "h-7 px-3 text-xs font-medium transition-all",
          currency === "USD"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
      >
        $ USD
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCurrencyChange("INR")}
        className={cn(
          "h-7 px-3 text-xs font-medium transition-all",
          currency === "INR"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
      >
        ₹ INR
      </Button>
    </div>
  );
};
