import * as React from "react";
import { City, CRM_STATUSES, CRMStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Search, Filter, X, Star, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CityListProps {
  cities: City[];
  selectedCityId: string | null;
  onSelectCity: (cityId: string) => void;
}

type SortOption = 'name' | 'temperature' | 'priority' | 'status' | 'lastVisit' | 'nextVisit';

export function CityList({ cities, selectedCityId, onSelectCity }: CityListProps) {
  const [search, setSearch] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<CRMStatus[]>([]);
  const [showPriorities, setShowPriorities] = React.useState<boolean | null>(null); // null = all, true = only priorities, false = no priorities
  const [selectedTemperatures, setSelectedTemperatures] = React.useState<('hot' | 'warm' | 'cold')[]>([]);
  const [sortBy, setSortBy] = React.useState<SortOption>('priority');

  const sortedAndFiltered = React.useMemo(() => {
    let result = cities.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(search.toLowerCase()) ||
        city.state.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(city.currentStatus);
      
      const matchesPriority = showPriorities === null || 
        (showPriorities === true && city.isPriority) ||
        (showPriorities === false && !city.isPriority);
      
      const matchesTemperature = selectedTemperatures.length === 0 || 
        (city.temperature && selectedTemperatures.includes(city.temperature));

      return matchesSearch && matchesStatus && matchesPriority && matchesTemperature;
    });

    // Sorting logic
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        return 0;
      }

      if (sortBy === 'temperature') {
        const tempOrder = { hot: 0, warm: 1, cold: 2, undefined: 3 };
        const aTemp = a.temperature || 'undefined';
        const bTemp = b.temperature || 'undefined';
        return tempOrder[aTemp as keyof typeof tempOrder] - tempOrder[bTemp as keyof typeof tempOrder];
      }

      if (sortBy === 'status') {
        const statusOrder = {
          "Contrato": 0,
          "Prefeito": 1,
          "Quantitativo": 2,
          "Posso": 3,
          "Devo": 4,
          "Quero": 5
        };
        return statusOrder[a.currentStatus] - statusOrder[b.currentStatus];
      }

      if (sortBy === 'lastVisit') {
        if (!a.lastVisit) return 1;
        if (!b.lastVisit) return -1;
        return b.lastVisit.getTime() - a.lastVisit.getTime();
      }

      if (sortBy === 'nextVisit') {
        if (!a.nextVisit) return 1;
        if (!b.nextVisit) return -1;
        return a.nextVisit.getTime() - b.nextVisit.getTime();
      }

      return a.name.localeCompare(b.name);
    });

    return result;
  }, [cities, search, selectedStatuses, showPriorities, selectedTemperatures, sortBy]);

  const groupedCities = React.useMemo(() => {
    const groups: { [key: string]: City[] } = {};
    
    if (sortBy === 'nextVisit') {
      sortedAndFiltered.forEach(city => {
        let label = "Não agendadas";
        if (city.nextVisit) {
          if (isToday(city.nextVisit)) label = "Hoje";
          else if (isTomorrow(city.nextVisit)) label = "Amanhã";
          else label = format(city.nextVisit, "EEEE", { locale: ptBR });
        }
        
        if (!groups[label]) groups[label] = [];
        groups[label].push(city);
      });
    } else if (sortBy === 'priority') {
      sortedAndFiltered.forEach(city => {
        const label = city.isPriority ? "Prioridades" : "Não Prioridades";
        
        if (!groups[label]) groups[label] = [];
        groups[label].push(city);
      });
    } else if (sortBy === 'status') {
      sortedAndFiltered.forEach(city => {
        const label = city.currentStatus;
        
        if (!groups[label]) groups[label] = [];
        groups[label].push(city);
      });
    } else if (sortBy === 'temperature') {
      sortedAndFiltered.forEach(city => {
        let label = "Sem temperatura";
        if (city.temperature === 'hot') label = "Quente";
        else if (city.temperature === 'warm') label = "Morna";
        else if (city.temperature === 'cold') label = "Fria";
        
        if (!groups[label]) groups[label] = [];
        groups[label].push(city);
      });
    } else {
      return null;
    }

    return groups;
  }, [sortedAndFiltered, sortBy]);

  const toggleStatus = (status: CRMStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setShowPriorities(null);
    setSelectedTemperatures([]);
    setSearch("");
  };

  const toggleTemperature = (temp: 'hot' | 'warm' | 'cold') => {
    setSelectedTemperatures(prev => 
      prev.includes(temp) 
        ? prev.filter(t => t !== temp)
        : [...prev, temp]
    );
  };

  const hasActiveFilters = selectedStatuses.length > 0 || showPriorities !== null || selectedTemperatures.length > 0;

  const renderCityCard = (city: City) => (
    <button
      key={city.id}
      onClick={() => onSelectCity(city.id)}
      className={cn(
        "w-full text-left p-2 rounded-lg border transition-all duration-200 group shadow-sm",
        selectedCityId === city.id 
          ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20" 
          : "bg-card border-border hover:bg-secondary/50"
      )}
      data-testid={`city-card-${city.id}`}
    >
      <div className="flex flex-col mb-0.5">
        <div className="flex justify-between items-center">
          <div className="font-medium text-xs text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 flex-1 min-w-0">
            {city.isPriority && <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500 shrink-0" />}
            <span className="truncate">{city.name}</span>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">{city.state}</span>
              {city.lastVisit && (
                <span className="text-[9px] text-muted-foreground/60 font-light">
                  • {format(city.lastVisit, "dd/MM", { locale: ptBR })}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {city.temperature === 'hot' && <span className="text-[10px]" title="Quente">🔥</span>}
            {city.temperature === 'warm' && <span className="text-[10px]" title="Morna">🌤️</span>}
            {city.temperature === 'cold' && <span className="text-[10px]" title="Fria">❄️</span>}
            <span className={cn(
              "text-[9px] px-1.5 py-0 rounded-full font-medium uppercase tracking-wider",
              getStatusBadgeColor(city.currentStatus)
            )}>
              {city.currentStatus}
            </span>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-heading font-semibold">Portfólio Comercial - Diego</h2>
          {hasActiveFilters && (
             <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
               {selectedStatuses.length + (showPriorities !== null ? 1 : 0) + selectedTemperatures.length} filtro(s)
             </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-7 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:bg-background transition-colors h-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-cities"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 bg-secondary/50 border-0 hover:bg-secondary">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Ordenar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('priority')} className="text-xs">
                  ⭐ Prioridades primeiro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('nextVisit')} className="text-xs">
                  📅 Próximas visitas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('temperature')} className="text-xs">
                  🔥 Temperatura (Quente → Fria)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('status')} className="text-xs">
                  📈 Funil (Contrato → Quero)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('lastVisit')} className="text-xs">
                  📅 Visita mais recente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')} className="text-xs">
                  🔤 Nome (A-Z)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={hasActiveFilters ? "default" : "outline"} 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 shrink-0",
                    hasActiveFilters ? "bg-primary text-primary-foreground" : "bg-secondary/50 border-0 hover:bg-secondary"
                  )}
                  data-testid="btn-filter-status"
                >
                  <Filter className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-xs">Filtros</h4>
                    {hasActiveFilters && (
                      <button 
                        onClick={clearFilters}
                        className="text-[10px] text-muted-foreground hover:text-primary"
                      >
                        Limpar tudo
                      </button>
                    )}
                  </div>
                  
                  {/* Prioridades Filter */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">Prioridades</h5>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-priorities-only" 
                          checked={showPriorities === true}
                          onCheckedChange={(checked) => setShowPriorities(checked ? true : null)}
                        />
                        <Label 
                          htmlFor="filter-priorities-only"
                          className="text-xs font-normal cursor-pointer flex-1 flex items-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          Apenas prioridades
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Temperature Filter */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">Temperatura</h5>
                    <div className="space-y-1">
                      {[
                        { id: 'hot' as const, label: '🔥 Quente', emoji: '🔥' },
                        { id: 'warm' as const, label: '🌤️ Média', emoji: '🌤️' },
                        { id: 'cold' as const, label: '❄️ Fria', emoji: '❄️' }
                      ].map((temp) => (
                        <div key={temp.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`filter-temp-${temp.id}`} 
                            checked={selectedTemperatures.includes(temp.id)}
                            onCheckedChange={() => toggleTemperature(temp.id)}
                          />
                          <Label 
                            htmlFor={`filter-temp-${temp.id}`}
                            className="text-xs font-normal cursor-pointer flex-1"
                          >
                            {temp.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">Status</h5>
                    <div className="space-y-1">
                      {selectedStatuses.length > 0 && (
                        <button 
                          onClick={() => setSelectedStatuses([])}
                          className="text-[10px] text-muted-foreground hover:text-primary mb-1"
                        >
                          Limpar status
                        </button>
                      )}
                      {CRM_STATUSES.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`filter-${status}`} 
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={() => toggleStatus(status)}
                          />
                          <Label 
                            htmlFor={`filter-${status}`}
                            className="text-xs font-normal cursor-pointer flex-1"
                          >
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-4">
          {sortedAndFiltered.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-xs">
              Vazio
            </div>
          ) : groupedCities ? (
            (() => {
              const entries = Object.entries(groupedCities);
              
              // Sort entries based on sortBy type
              const sortedEntries = entries.sort(([a], [b]) => {
                if (sortBy === 'priority') {
                  if (a === "Prioridades") return -1;
                  if (b === "Prioridades") return 1;
                  return 0;
                } else if (sortBy === 'status') {
                  const statusOrder: { [key: string]: number } = {
                    "Contrato": 0,
                    "Prefeito": 1,
                    "Quantitativo": 2,
                    "Posso": 3,
                    "Devo": 4,
                    "Quero": 5
                  };
                  return (statusOrder[a] ?? 999) - (statusOrder[b] ?? 999);
                } else if (sortBy === 'temperature') {
                  const tempOrder: { [key: string]: number } = {
                    "Quente": 0,
                    "Morna": 1,
                    "Fria": 2,
                    "Sem temperatura": 3
                  };
                  return (tempOrder[a] ?? 999) - (tempOrder[b] ?? 999);
                }
                return 0;
              });
              
              return sortedEntries.map(([label, items]) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center gap-2 px-1">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  {items.map(renderCityCard)}
                </div>
              ));
            })()
          ) : (
            <div className="space-y-1.5">
              {sortedAndFiltered.map(renderCityCard)}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case "Quero": return "bg-slate-100 text-slate-600 border border-slate-200";
    case "Devo": return "bg-slate-200 text-slate-700 border border-slate-300";
    case "Posso": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "Quantitativo": return "bg-orange-100 text-orange-700 border border-orange-200";
    case "Prefeito": return "bg-purple-100 text-purple-700 border border-purple-200";
    case "Contrato": return "bg-green-100 text-green-700 border border-green-200";
    default: return "bg-gray-100 text-gray-600";
  }
}
