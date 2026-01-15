import * as React from "react";
import { useLocation } from "wouter";
import { mockCities, mockSalesReps, City, CRMStatus, Interaction } from "@/lib/mockData";
import { CityList } from "@/components/dashboard/CityList";
import { CRM_STATUSES } from "@/lib/mockData";
import { Timeline } from "@/components/dashboard/Timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Calendar, User, MapPin, ArrowLeft, PanelLeft, ChevronLeft, ChevronRight, Thermometer, Info, Star, ChevronDown, ChevronUp, Landmark, GraduationCap, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <header className="relative h-12 border-b border-border flex items-center justify-between px-4 bg-card shrink-0 z-10">
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
        </div>
        
        {/* Centered CONTAGIE Logo and Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <img 
              src="/favicon.png" 
              alt="CONTAGIE Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-heading font-bold text-base leading-none text-foreground">
            CONTAGIE
          </h1>
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
                {/* City Name */}
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-lg md:text-xl font-heading font-bold text-foreground tracking-tight truncate flex items-center gap-2">
                    {selectedCity.name}
                    <span className="text-sm font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">{selectedCity.state}</span>
                  </h2>
                  
                  {/* Information Panel Trigger */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                      <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl font-heading">Informações Estratégicas</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">{selectedCity.name}, {selectedCity.state}</p>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Liderança Política */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                                <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">Liderança Política</h3>
                            </div>
                            <div className="space-y-3 pl-12">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Prefeito</p>
                                <p className="text-sm font-medium">{selectedCity.mayor || "João Silva (MDB)"}</p>
                              </div>
                              <Separator />
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Vice-Prefeito</p>
                                <p className="text-sm font-medium">{selectedCity.viceMayor || "Maria Santos (PT)"}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Educação */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">Educação</h3>
                            </div>
                            <div className="space-y-3 pl-12">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Secretário de Educação</p>
                                <p className="text-sm font-medium">{selectedCity.educationSecretary || "Ana Paula"}</p>
                              </div>
                              <Separator />
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Gastos com Educação</p>
                                <div className="space-y-2">
                                  <p className="text-lg font-bold text-primary">R$ {selectedCity.educationSpending || "4.2M"}</p>
                                  <div className="flex items-center gap-2">
                                    <div className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                                      <span className="text-sm font-bold text-primary">24.5%</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">do orçamento</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Status VAAR */}
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-4">
                              <div className={cn(
                                "p-2 rounded-lg",
                                selectedCity.isInVAAR ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
                              )}>
                                <span className="text-lg">🏛️</span>
                              </div>
                              <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">Status VAAR</h3>
                            </div>
                            <div className="pl-12 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  selectedCity.isInVAAR ? "bg-green-500" : "bg-red-500"
                                )} />
                                <p className={cn(
                                  "text-sm font-semibold",
                                  selectedCity.isInVAAR ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                  {selectedCity.isInVAAR ? "No VAAR" : "Não está no VAAR"}
                                </p>
                              </div>
                              {!selectedCity.isInVAAR && (
                                <>
                                  <Separator className="my-2" />
                                  <div className="bg-muted/50 rounded-md p-3">
                                    <p className="text-xs text-muted-foreground mb-1">Motivo</p>
                                    <p className="text-xs leading-relaxed">Falta condicionalidade III (Gestão Democrática)</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Controls Row: Prioridade, Temperature, Status Phase */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Prioridade Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-2 rounded-full transition-all text-[10px] font-bold uppercase tracking-wider gap-1.5",
                      selectedCity.isPriority 
                        ? "text-yellow-600 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 shadow-sm" 
                        : "text-muted-foreground hover:text-yellow-600 hover:bg-yellow-50/50"
                    )}
                    onClick={handleTogglePriority}
                    data-testid="btn-toggle-priority"
                  >
                    <Star className={cn("h-3 w-3", selectedCity.isPriority && "fill-current")} />
                    Prioridade
                  </Button>
                  
                  {/* Temperature Control Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-2 rounded-full transition-all text-[10px] font-medium gap-1.5",
                          selectedCity.temperature === 'cold' 
                            ? "text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100" 
                            : selectedCity.temperature === 'warm'
                            ? "text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100"
                            : selectedCity.temperature === 'hot'
                            ? "text-red-600 bg-red-50 border border-red-200 hover:bg-red-100"
                            : "text-muted-foreground border border-border hover:bg-secondary/50"
                        )}
                      >
                        {selectedCity.temperature === 'cold' && <span>❄️</span>}
                        {selectedCity.temperature === 'warm' && <span>🌤️</span>}
                        {selectedCity.temperature === 'hot' && <span>🔥</span>}
                        {selectedCity.temperature === 'cold' && 'Fria'}
                        {selectedCity.temperature === 'warm' && 'Morna'}
                        {selectedCity.temperature === 'hot' && 'Quente'}
                        {!selectedCity.temperature && 'Temperatura'}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      {[
                        { id: 'cold', label: 'Fria', icon: '❄️' },
                        { id: 'warm', label: 'Morna', icon: '🌤️' },
                        { id: 'hot', label: 'Quente', icon: '🔥' }
                      ].map((t) => (
                        <DropdownMenuItem
                          key={t.id}
                          onClick={() => handleTemperatureChange(t.id as any)}
                          className={cn(
                            "text-xs cursor-pointer",
                            selectedCity.temperature === t.id && "bg-secondary"
                          )}
                        >
                          <span className="mr-2">{t.icon}</span>
                          {t.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Status Phase Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-2 rounded-full transition-all text-[10px] font-medium gap-1.5 border",
                          selectedCity.currentStatus === 'Quero' 
                            ? "bg-slate-100 text-slate-700 border-slate-200" 
                            : selectedCity.currentStatus === 'Devo'
                            ? "bg-slate-200 text-slate-700 border-slate-300"
                            : selectedCity.currentStatus === 'Posso'
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : selectedCity.currentStatus === 'Quantitativo'
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : selectedCity.currentStatus === 'Prefeito'
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : selectedCity.currentStatus === 'Contrato'
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "text-muted-foreground border-border hover:bg-secondary/50"
                        )}
                      >
                        {selectedCity.currentStatus}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {CRM_STATUSES.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={cn(
                            "text-xs cursor-pointer",
                            selectedCity.currentStatus === status && "bg-secondary"
                          )}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
