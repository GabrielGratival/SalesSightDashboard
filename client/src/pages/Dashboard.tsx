import * as React from "react";
import { useLocation } from "wouter";
import { mockCities, mockSalesReps, City, CRMStatus, Interaction } from "@/lib/mockData";
import { CityList } from "@/components/dashboard/CityList";
import { StatusPipeline } from "@/components/dashboard/StatusPipeline";
import { Timeline } from "@/components/dashboard/Timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Calendar, User, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [cities, setCities] = React.useState<City[]>(mockCities);
  const [selectedCityId, setSelectedCityId] = React.useState<string | null>(cities[0]?.id || null);
  const [isMobileListView, setIsMobileListView] = React.useState(true);
  const currentUser = mockSalesReps[0]; // Mock logged in user

  const selectedCity = React.useMemo(
    () => cities.find(c => c.id === selectedCityId), 
    [cities, selectedCityId]
  );

  const handleSelectCity = (cityId: string) => {
    setSelectedCityId(cityId);
    setIsMobileListView(false);
  };

  const handleBackToList = () => {
    setIsMobileListView(true);
  };

  const handleStatusChange = (newStatus: CRMStatus) => {
    if (!selectedCityId) return;
    
    setCities(prev => prev.map(city => 
      city.id === selectedCityId 
        ? { ...city, currentStatus: newStatus } 
        : city
    ));
  };

  const handleAddInteraction = (type: "audio" | "note" | "image", content: string) => {
    if (!selectedCityId) return;

    const newInteraction: Interaction = {
      id: `new-${Date.now()}`,
      type,
      content,
      duration: type === "audio" ? "0:15" : undefined,
      createdAt: new Date(),
      author: currentUser.name
    };

    setCities(prev => prev.map(city => 
      city.id === selectedCityId 
        ? { ...city, interactions: [newInteraction, ...city.interactions] }
        : city
    ));
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card shrink-0 z-10">
        <div className="flex items-center gap-2">
          {/* Mobile Back Button (only visible when in detail view on mobile) */}
          {!isMobileListView && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden -ml-2 mr-1" 
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg leading-none text-foreground">GovCRM</h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest hidden sm:block">Dashboard Comercial</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">Representante Comercial</p>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - City List */}
        <aside className={cn(
          "w-full md:w-[350px] shrink-0 h-full transition-all duration-300 ease-in-out",
          isMobileListView ? "block" : "hidden md:block"
        )}>
          <CityList 
            cities={cities} 
            selectedCityId={selectedCityId} 
            onSelectCity={handleSelectCity} 
          />
        </aside>

        {/* Main Workspace */}
        <main className={cn(
          "flex-1 flex flex-col min-w-0 bg-background relative",
          isMobileListView ? "hidden md:flex" : "flex"
        )}>
          {selectedCity ? (
            <>
              {/* City Header & Context */}
              <div className="p-4 md:p-6 pb-2 bg-card border-b border-border shadow-sm z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1 tracking-tight">
                      {selectedCity.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {selectedCity.state}
                      </span>
                      <span className="hidden md:inline w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" /> {(selectedCity.population / 1000).toFixed(1)}k
                      </span>
                      {selectedCity.lastVisit && (
                        <>
                          <span className="hidden md:inline w-1 h-1 rounded-full bg-border" />
                          <span className="flex items-center gap-1.5 text-orange-600/80">
                            <Calendar className="w-4 h-4" /> {format(selectedCity.lastVisit, "d MMM", { locale: ptBR })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border/50 self-start w-full md:w-auto">
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                       Próxima Ação
                     </span>
                     <span className="font-medium text-foreground">
                       {selectedCity.nextAction || "Nenhuma ação agendada"}
                     </span>
                  </div>
                </div>

                {/* Pipeline Visualizer */}
                <div className="mt-4">
                  <StatusPipeline 
                    currentStatus={selectedCity.currentStatus} 
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </div>

              {/* Timeline & Interactions */}
              <div className="flex-1 overflow-hidden">
                <Timeline 
                  interactions={selectedCity.interactions}
                  onAddInteraction={handleAddInteraction}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecione uma cidade para ver detalhes
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
