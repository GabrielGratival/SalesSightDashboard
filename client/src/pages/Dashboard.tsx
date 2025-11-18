import * as React from "react";
import { useLocation } from "wouter";
import { mockCities, mockSalesReps, City, CRMStatus, Interaction } from "@/lib/mockData";
import { CityList } from "@/components/dashboard/CityList";
import { StatusPipeline } from "@/components/dashboard/StatusPipeline";
import { Timeline } from "@/components/dashboard/Timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Calendar, User, MapPin, ArrowLeft, PanelLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [cities, setCities] = React.useState<City[]>(mockCities);
  const [selectedCityId, setSelectedCityId] = React.useState<string | null>(cities[0]?.id || null);
  const [isMobileListView, setIsMobileListView] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        ? { ...city, interactions: [...city.interactions, newInteraction] }
        : city
    ));
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-card shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          {!isMobileListView && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden -ml-2" 
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Desktop Sidebar Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex -ml-2 text-muted-foreground hover:text-primary h-8 w-8" 
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-base leading-none text-foreground">GovCRM</h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-medium">{currentUser.name}</p>
          </div>
          <Avatar className="h-7 w-7 ring-2 ring-background shadow-sm">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - City List */}
        <aside className={cn(
          "shrink-0 h-full transition-all duration-300 ease-in-out border-r border-border bg-card overflow-hidden",
          isMobileListView ? "w-full block" : "hidden md:block",
          !isSidebarOpen ? "md:w-0 md:border-r-0" : "md:w-[320px]"
        )}>
          <div className="w-full h-full min-w-[320px]">
             <CityList 
               cities={cities} 
               selectedCityId={selectedCityId} 
               onSelectCity={handleSelectCity} 
             />
          </div>
        </aside>

        {/* Main Workspace */}
        <main className={cn(
          "flex-1 flex flex-col min-w-0 bg-background relative",
          isMobileListView ? "hidden md:flex" : "flex"
        )}>
          {selectedCity ? (
            <>
              {/* City Header & Context - Ultra Compact Version */}
              <div className="bg-card border-b border-border shadow-sm z-10 px-4 py-2 md:px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-lg md:text-xl font-heading font-bold text-foreground tracking-tight truncate">
                        {selectedCity.name}
                      </h2>
                      <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> {selectedCity.state}
                        </span>
                        <span className="w-0.5 h-0.5 rounded-full bg-border" />
                        <span className="flex items-center gap-0.5">
                          <User className="w-3 h-3" /> {(selectedCity.population / 1000).toFixed(0)}k
                        </span>
                        {selectedCity.lastVisit && (
                          <>
                            <span className="w-0.5 h-0.5 rounded-full bg-border" />
                            <span className="flex items-center gap-0.5 text-orange-600/80">
                              <Calendar className="w-3 h-3" /> {format(selectedCity.lastVisit, "d MMM", { locale: ptBR })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-start md:self-center w-full md:w-auto bg-secondary/30 px-2 py-1 rounded-md border border-border/50">
                     <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                       Próx:
                     </span>
                     <span className="text-xs font-medium text-foreground truncate max-w-[200px]">
                       {selectedCity.nextAction || "Nenhuma"}
                     </span>
                  </div>
                </div>

                {/* Pipeline Visualizer */}
                <div className="w-full -mt-1">
                  <StatusPipeline 
                    currentStatus={selectedCity.currentStatus} 
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </div>

              {/* Timeline & Interactions */}
              <div className="flex-1 overflow-hidden bg-secondary/5">
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
