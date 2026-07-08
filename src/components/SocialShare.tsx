import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Share2, Mail, Link2, Copy, Twitter, Facebook, MessageCircle } from "lucide-react";

interface SocialShareProps {
  itinerary: {
    destination: string;
    summary: string;
    days: any[];
    totalEstimatedCost: string;
  };
}

export const SocialShare = ({ itinerary }: SocialShareProps) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const { toast } = useToast();

  const shareUrl = window.location.href;
  const shareTitle = `Check out my ${itinerary.destination} trip itinerary!`;
  const shareText = `${itinerary.summary}\n\n${itinerary.days.length} days • ${itinerary.totalEstimatedCost} estimated`;

  const copyToClipboard = async () => {
    const itineraryText = `
🗺️ ${itinerary.destination} Trip Itinerary

${itinerary.summary}

📅 ${itinerary.days.length} days
💰 ${itinerary.totalEstimatedCost}

${itinerary.days.map(day => `
Day ${day.day}: ${day.title}
${day.activities.map((a: any) => `• ${a.time} - ${a.activity}`).join('\n')}
`).join('\n')}

Created with TravelMate ✈️
    `.trim();

    try {
      await navigator.clipboard.writeText(itineraryText);
      toast({
        title: "Copied to clipboard!",
        description: "Your itinerary has been copied.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Please try again.",
      });
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n\n${shareText}\n\n${shareUrl}`)}`;
    window.open(url, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${emailMessage}\n\n${shareText}\n\nView my trip: ${shareUrl}`);
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    setEmailDialogOpen(false);
    toast({
      title: "Email client opened",
      description: "Complete sending in your email app.",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
            <Copy className="w-4 h-4" />
            Copy Itinerary
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEmailDialogOpen(true)} className="gap-2 cursor-pointer">
            <Mail className="w-4 h-4" />
            Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToTwitter} className="gap-2 cursor-pointer">
            <Twitter className="w-4 h-4" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToFacebook} className="gap-2 cursor-pointer">
            <Facebook className="w-4 h-4" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToWhatsApp} className="gap-2 cursor-pointer">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share via Email</DialogTitle>
            <DialogDescription>
              Send your {itinerary.destination} itinerary to a friend
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Check out my upcoming trip!"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={handleEmailShare} className="w-full gap-2">
              <Mail className="w-4 h-4" />
              Open Email Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
