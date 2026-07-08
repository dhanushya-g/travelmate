import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PlaceHistory {
  title: string;
  description: string;
  timeline: string;
  keyFacts: string[];
}

interface PlaceHistoryModalProps {
  placeName: string;
  destination: string;
}

const PlaceHistoryModal = ({ placeName, destination }: PlaceHistoryModalProps) => {
  const [history, setHistory] = useState<PlaceHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchHistory = async () => {
    if (history) return; // Already fetched
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-place-history', {
        body: { placeName, destination }
      });

      if (fnError) throw fnError;
      
      setHistory(data);
    } catch (err) {
      console.error('Error fetching place history:', err);
      setError('Unable to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchHistory();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
          <History className="w-3 h-3" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <BookOpen className="w-5 h-5 text-primary" />
            History of {placeName}
          </DialogTitle>
        </DialogHeader>
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-muted-foreground text-sm">Loading historical information...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={fetchHistory}>Try Again</Button>
          </div>
        )}

        {history && !loading && (
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Timeline Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {history.timeline}
              </div>

              {/* Description */}
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">{history.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{history.description}</p>
              </section>

              {/* Key Facts */}
              {history.keyFacts && history.keyFacts.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Key Historical Facts</h3>
                  <div className="space-y-2">
                    {history.keyFacts.map((fact, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-foreground text-sm">{fact}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlaceHistoryModal;
