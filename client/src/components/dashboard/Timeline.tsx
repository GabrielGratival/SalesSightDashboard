import * as React from "react";
import { Interaction } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Mic, FileText, MapPin, Send, Flag, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TimelineProps {
  interactions: Interaction[];
  onAddInteraction: (type: "audio" | "note", content: string) => void;
}

export function Timeline({ interactions, onAddInteraction }: TimelineProps) {
  const [newNote, setNewNote] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!newNote.trim()) return;
    onAddInteraction("note", newNote);
    setNewNote("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-secondary/10">
      <div className="p-4 border-b border-border bg-card">
        <h3 className="font-heading font-medium text-lg">Interaction History</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 max-w-3xl mx-auto pb-4">
          {interactions.map((interaction) => (
            <div key={interaction.id} className="flex gap-4 group">
              <div className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0 border",
                  getIconStyles(interaction.type)
                )}>
                  {getIcon(interaction.type)}
                </div>
                <div className="w-0.5 flex-1 bg-border group-last:hidden" />
              </div>
              
              <div className="flex-1 pt-1 pb-6">
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{interaction.author}</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md capitalize">
                      {interaction.type}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {format(interaction.createdAt, "MMM d, HH:mm")}
                  </span>
                </div>

                <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                  {interaction.type === "audio" ? (
                    <AudioPlayer duration={interaction.duration} />
                  ) : (
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {interaction.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-secondary/30 rounded-xl p-2 border border-input focus-within:border-primary/50 focus-within:bg-background transition-all">
            <Textarea 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a note about this city..."
              className="min-h-[60px] border-0 bg-transparent resize-none focus-visible:ring-0 p-2 text-sm"
              data-testid="input-new-note"
            />
            <div className="flex justify-between items-center px-2 pb-1 mt-2">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                  onClick={() => onAddInteraction("audio", "Voice note recorded")}
                  data-testid="btn-record-audio"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                  onClick={() => {}}
                >
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                size="sm" 
                onClick={handleSend} 
                disabled={!newNote.trim()}
                className="rounded-full px-4"
                data-testid="btn-send-note"
              >
                Add Note <Send className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getIcon(type: Interaction["type"]) {
  switch (type) {
    case "audio": return <Mic className="w-5 h-5" />;
    case "note": return <FileText className="w-5 h-5" />;
    case "visit": return <MapPin className="w-5 h-5" />;
    case "cta": return <Flag className="w-5 h-5" />;
  }
}

function getIconStyles(type: Interaction["type"]) {
  switch (type) {
    case "audio": return "bg-blue-100 text-blue-600 border-blue-200";
    case "note": return "bg-slate-100 text-slate-600 border-slate-200";
    case "visit": return "bg-orange-100 text-orange-600 border-orange-200";
    case "cta": return "bg-red-100 text-red-600 border-red-200";
  }
}

function AudioPlayer({ duration }: { duration?: string }) {
  const [playing, setPlaying] = React.useState(false);

  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full shrink-0 text-primary hover:text-primary hover:bg-primary/10"
        onClick={() => setPlaying(!playing)}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </Button>
      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary/80 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: playing ? "60%" : "0%" }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground">{duration || "0:00"}</span>
    </div>
  );
}
