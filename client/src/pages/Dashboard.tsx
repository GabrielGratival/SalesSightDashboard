import * as React from "react";
import { useLocation } from "wouter";
import { mockCities, mockSalesReps, City, CRMStatus, Interaction } from "@/lib/mockData";
import { CityList } from "@/components/dashboard/CityList";
import { StatusPipeline } from "@/components/dashboard/StatusPipeline";
import { Timeline } from "@/components/dashboard/Timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Calendar, User, MapPin, ArrowLeft, PanelLeft, ChevronLeft, ChevronRight, Thermometer, Info, Star, ChevronDown, ChevronUp, Landmark, GraduationCap, Coins } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Dashboard() {
  const [cities, setCities] = React.useState<City[]>(mockCities);
  const [selectedCityId, setSelectedCityId] = React.useState<string | null>(cities[0]?.id || null);
  const [isMobileListView, setIsMobileListView] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isInfoExpanded, setIsInfoExpanded] = React.useState(false);
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

  const handleTogglePriority = () => {
    if (!selectedCityId) return;
    setCities(prev => prev.map(city => 
      city.id === selectedCityId 
        ? { ...city, isPriority: !city.isPriority } 
        : city
    ));
  };

  const handleTemperatureChange = (temp: 'cold' | 'warm' | 'hot') => {
    if (!selectedCityId) return;
    setCities(prev => prev.map(city => 
      city.id === selectedCityId 
        ? { ...city, temperature: temp } 
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
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg md:text-xl font-heading font-bold text-foreground tracking-tight truncate flex items-center gap-2">
                        {selectedCity.name}
                        <span className="text-sm font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">{selectedCity.state}</span>
                      </h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8 rounded-full transition-colors",
                          selectedCity.isPriority ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50" : "text-muted-foreground hover:text-yellow-500"
                        )}
                        onClick={handleTogglePriority}
                        data-testid="btn-toggle-priority"
                      >
                        <Star className={cn("h-4 w-4", selectedCity.isPriority && "fill-current")} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Temperature Control */}
                  <div className="flex items-center bg-secondary/30 p-1 rounded-lg border border-border/50">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 px-1 mr-1 text-muted-foreground">
                            <Thermometer className="w-3 h-3" />
                            <Info className="w-2.5 h-2.5 opacity-50" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Classificação de temperatura comercial</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-0.5">
                      {[
                        { id: 'cold', label: '❄️ Fria', color: 'text-blue-600 bg-blue-50 border-blue-100' },
                        { id: 'warm', label: '🌤️ Morna', color: 'text-orange-600 bg-orange-50 border-orange-100' },
                        { id: 'hot', label: '🔥 Quente', color: 'text-red-600 bg-red-50 border-red-100' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleTemperatureChange(t.id as any)}
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold transition-all border border-transparent",
                            selectedCity.temperature === t.id 
                              ? t.color + " border-current shadow-sm" 
                              : "text-muted-foreground hover:bg-secondary/50"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pipeline Visualizer */}
                <div className="w-full -mt-1">
                  <StatusPipeline 
                    currentStatus={selectedCity.currentStatus} 
                    onStatusChange={handleStatusChange}
                  />
                </div>

                {/* Strategic Info Collapsible */}
                <Collapsible
                  open={isInfoExpanded}
                  onOpenChange={setIsInfoExpanded}
                  className="mt-2 border-t border-border/40 pt-2"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full h-7 flex items-center justify-between px-2 hover:bg-secondary/30 text-muted-foreground group">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <Info className="w-3 h-3" />
                        Informações Estratégicas
                      </div>
                      {isInfoExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-3 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-2 gap-4 px-2">
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tighter">
                            <Landmark className="w-3 h-3" /> Liderança Política
                          </span>
                          <span className="text-xs font-medium">Prefeito: {selectedCity.mayor || "João Silva (MDB)"}</span>
                          <span className="text-[10px] text-muted-foreground">Vice: {selectedCity.viceMayor || "Maria Santos (PT)"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tighter">
                            <GraduationCap className="w-3 h-3" /> Educação
                          </span>
                          <span className="text-xs font-medium">Sec. Educação: {selectedCity.educationSecretary || "Ana Paula"}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tighter">
                            <Coins className="w-3 h-3" /> Gastos Educação
                          </span>
                          <span className="text-xs font-bold text-primary">R$ {selectedCity.educationSpending || "4.2M"}</span>
                          <span className="text-[10px] text-muted-foreground">24.5% do orçamento</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tighter">
                            🏛️ Status VAAR
                          </span>
                          <span className={cn(
                            "text-xs font-bold",
                            selectedCity.isInVAAR ? "text-green-600" : "text-red-600"
                          )}>
                            {selectedCity.isInVAAR ? "No VAAR" : "Não está no VAAR"}
                          </span>
                          {!selectedCity.isInVAAR && (
                            <span className="text-[10px] text-muted-foreground leading-tight">Motivo: Falta condicionalidade III (Gestão Democrática)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
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
