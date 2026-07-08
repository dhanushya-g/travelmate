import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, BookOpen } from "lucide-react";

interface HistoryData {
  title: string;
  timeline: string;
  overview: string;
  keyEvents: { year: string; event: string }[];
  culturalSignificance: string;
  images: { url: string; caption: string }[];
}

interface HistoryModalProps {
  destinationName: string;
  history: HistoryData | null;
}

const HistoryModal = ({ destinationName, history }: HistoryModalProps) => {
  if (!history) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="w-4 h-4" />
          View History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-display">
            <BookOpen className="w-6 h-6 text-primary" />
            History of {destinationName}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Timeline Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {history.timeline}
            </div>

            {/* Overview */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">{history.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{history.overview}</p>
            </section>

            {/* Historical Images */}
            {history.images.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">Historical Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {history.images.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">{img.caption}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Historical Events */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">Key Historical Events</h3>
              <div className="space-y-3">
                {history.keyEvents.map((event, index) => (
                  <div key={index} className="flex gap-4 p-3 rounded-lg bg-muted/50">
                    <span className="font-bold text-primary min-w-[80px]">{event.year}</span>
                    <span className="text-foreground">{event.event}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Cultural Significance */}
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cultural Significance</h3>
              <p className="text-muted-foreground leading-relaxed">{history.culturalSignificance}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
