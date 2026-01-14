import * as React from "react";
import { Interaction } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mic, FileText, MapPin, Send, Flag, Play, Pause, Camera, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TimelineProps {
  interactions: Interaction[];
  onAddInteraction: (type: "audio" | "note" | "image", content: string) => void;
}

export function Timeline({ interactions, onAddInteraction }: TimelineProps) {
  const [newNote, setNewNote] = React.useState("");
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [interactions]);
  
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

  const handleCapture = () => {
    // Simulate capturing an image
    const randomImage = `https://picsum.photos/seed/${Date.now()}/800/600`;
    onAddInteraction("image", randomImage);
    setIsCameraOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-secondary/10">
      <div className="px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="font-heading font-medium text-xs text-muted-foreground uppercase tracking-wider">Histórico de Interações</h3>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3 max-w-3xl mx-auto pb-4">
          {interactions.map((interaction) => (
            <div key={interaction.id} className="flex gap-3 group">
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shadow-sm shrink-0 border",
                  getIconStyles(interaction.type)
                )}>
                  {getIcon(interaction.type)}
                </div>
                <div className="w-px flex-1 bg-border group-last:hidden" />
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-foreground">{interaction.author}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono capitalize">
                    {format(interaction.createdAt, "d MMM, HH:mm", { locale: ptBR })}
                  </span>
                </div>

                <div className={cn(
                  "bg-card rounded-lg rounded-tl-none border border-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden w-fit",
                  interaction.type === "image" ? "p-0" : "p-2.5"
                )}>
                  {interaction.type === "audio" ? (
                    <AudioPlayer duration={interaction.duration} />
                  ) : interaction.type === "image" ? (
                    <div className="relative w-full max-w-[200px]">
                      <img 
                        src={interaction.content} 
                        alt="Anexo da interação" 
                        className="w-full h-auto block"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/90 leading-snug whitespace-pre-wrap">
                      {interaction.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-secondary/30 rounded-xl p-1.5 border border-input focus-within:border-primary/50 focus-within:bg-background transition-all">
            <Textarea 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite uma nota particular (visível somente para você)"
              className="min-h-[40px] border-0 bg-transparent resize-none focus-visible:ring-0 p-2 text-sm"
              data-testid="input-new-note"
            />
            <div className="flex justify-between items-center px-1 pb-0.5 mt-1">
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                  onClick={() => onAddInteraction("audio", "Nota de voz gravada")}
                  data-testid="btn-record-audio"
                >
                  <Mic className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                  onClick={() => setIsCameraOpen(true)}
                  data-testid="btn-open-camera"
                >
                  <Camera className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Button 
                size="sm" 
                onClick={handleSend} 
                disabled={!newNote.trim()}
                className="rounded-full px-3 h-7 text-xs"
                data-testid="btn-send-note"
              >
                Enviar <Send className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 bg-black border-zinc-800">
          <div className="relative aspect-[4/3] bg-zinc-900 flex items-center justify-center overflow-hidden">
            {/* Camera Viewfinder UI */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-zinc-500 flex flex-col items-center gap-2">
                <Camera className="w-12 h-12 opacity-20" />
                <span className="text-xs font-mono uppercase tracking-widest opacity-40">Câmera</span>
              </div>
            </div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white/30" />
              ))}
            </div>

            {/* Interface Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-end pb-8">
              <Button 
                size="lg" 
                className="h-16 w-16 rounded-full border-4 border-white bg-transparent hover:bg-white/20 p-1 group relative"
                onClick={handleCapture}
                data-testid="btn-capture-image"
              >
                <span className="absolute inset-1.5 rounded-full bg-white group-active:scale-90 transition-transform duration-100" />
              </Button>
            </div>
            
            <button 
              onClick={() => setIsCameraOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/20 rounded-full backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getInteractionTypeLabel(type: Interaction["type"]) {
  switch (type) {
    case "audio": return "Áudio";
    case "note": return "Nota";
    case "visit": return "Visita";
    case "cta": return "CTA";
    case "image": return "Imagem";
    default: return type;
  }
}

function getIcon(type: Interaction["type"]) {
  switch (type) {
    case "audio": return <Mic className="w-3.5 h-3.5" />;
    case "note": return <FileText className="w-3.5 h-3.5" />;
    case "visit": return <MapPin className="w-3.5 h-3.5" />;
    case "cta": return <Flag className="w-3.5 h-3.5" />;
    case "image": return <ImageIcon className="w-3.5 h-3.5" />;
  }
}

function getIconStyles(type: Interaction["type"]) {
  switch (type) {
    case "audio": return "bg-blue-100 text-blue-600 border-blue-200";
    case "note": return "bg-slate-100 text-slate-600 border-slate-200";
    case "visit": return "bg-orange-100 text-orange-600 border-orange-200";
    case "cta": return "bg-red-100 text-red-600 border-red-200";
    case "image": return "bg-pink-100 text-pink-600 border-pink-200";
  }
}

function AudioPlayer({ duration }: { duration?: string }) {
  const [playing, setPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState<1 | 1.5 | 2>(1);

  const toggleSpeed = () => {
    if (speed === 1) setSpeed(1.5);
    else if (speed === 1.5) setSpeed(2);
    else setSpeed(1);
  };

  return (
    <div className="flex items-center gap-2 min-w-[180px]">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 rounded-full shrink-0 text-primary hover:text-primary hover:bg-primary/10"
        onClick={() => setPlaying(!playing)}
      >
        {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
      </Button>
      
      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden mx-1">
        <div 
          className="h-full bg-primary/80 rounded-full transition-all ease-linear"
          style={{ 
            width: playing ? "60%" : "0%",
            transitionDuration: playing ? `${(1000 / speed)}ms` : '0ms' 
          }}
        />
      </div>
      
      <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{duration || "0:00"}</span>
      
      <button 
        onClick={toggleSpeed}
        className="text-[9px] font-bold text-primary/80 hover:text-primary bg-primary/5 hover:bg-primary/10 px-1.5 py-0.5 rounded-md min-w-[28px] transition-colors"
      >
        {speed}x
      </button>
    </div>
  );
}
