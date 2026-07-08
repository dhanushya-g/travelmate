import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Destinations", href: "#destinations" },
    { label: "Itineraries", href: "#itineraries" },
    { label: "Hotels", href: "#hotels" },
    { label: "Guides", href: "#guides" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-soft py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                isScrolled
                  ? "bg-primary"
                  : "bg-background/20 backdrop-blur-sm"
              )}
            >
              <MapPin
                className={cn(
                  "w-5 h-5 transition-colors",
                  isScrolled ? "text-primary-foreground" : "text-background"
                )}
              />
            </div>
            <span
              className={cn(
                "text-xl font-display font-bold transition-colors",
                isScrolled ? "text-foreground" : "text-background"
              )}
            >
              TravelMate
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "font-medium transition-colors hover:text-primary",
                  isScrolled ? "text-foreground" : "text-background/90 hover:text-background"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant={isScrolled ? "ghost" : "heroOutline"}
              size="sm"
              onClick={() => navigate("/auth")}
            >
              <User className="w-4 h-4" />
              Sign In
            </Button>
            <Button
              variant={isScrolled ? "default" : "hero"}
              size="sm"
              onClick={() => navigate("/plan")}
            >
              Plan Trip
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isScrolled
                ? "text-foreground hover:bg-muted"
                : "text-background hover:bg-background/10"
            )}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-2 bg-background/95 backdrop-blur-lg rounded-2xl p-4 shadow-elevated">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigate("/auth");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigate("/plan");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Plan Trip
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
