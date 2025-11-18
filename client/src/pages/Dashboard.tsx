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
        ? { ...city, interactions: [newInteraction, ...city.interactions] }
        : city
    ));
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          {!isMobileListView && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden -ml-2" 
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Desktop Sidebar Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex -ml-2 text-muted-foreground hover:text-primary" 
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-base leading-none text-foreground">GovCRM</h1>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest hidden sm:block">Dashboard Comercial</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-medium">{currentUser.name}</p>
            <p className="text-[10px] text-muted-foreground">Representante</p>
          </div>
          <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
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
          !isSidebarOpen && !isMobileListView ? "w-0 border-r-0" : "md:w-[320px]"
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
              {/* City Header & Context - Compact Version */}
              <div className="bg-card border-b border-border shadow-sm z-10 px-4 py-3 md:px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground tracking-tight truncate">
                        {selectedCity.name}
                      </h2>
                      <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {selectedCity.state}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {(selectedCity.population / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>
                    
                    {/* Mobile only sub-info */}
                    <div className="flex md:hidden items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {selectedCity.state}
                      </span>
                      <span className="flex items-center gap-1">
                         <User className="w-3 h-3" /> {(selectedCity.population / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-start md:self-center w-full md:w-auto bg-secondary/30 px-3 py-1.5 rounded-md border border-border/50">
                     <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                       Próxima Ação:
                     </span>
                     <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                       {selectedCity.nextAction || "Nenhuma"}
                     </span>
                  </div>
                </div>

                {/* Pipeline Visualizer */}
                <div className="w-full">
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
