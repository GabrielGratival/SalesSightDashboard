import * as React from "react";
import { City, CRM_STATUSES, CRMStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ChevronRight, Search, Filter, X } from "lucide-react";
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

interface CityListProps {
  cities: City[];
  selectedCityId: string | null;
  onSelectCity: (cityId: string) => void;
}

export function CityList({ cities, selectedCityId, onSelectCity }: CityListProps) {
  const [search, setSearch] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<CRMStatus[]>([]);

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.state.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(city.currentStatus);

    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (status: CRMStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSearch("");
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-heading font-semibold">Meu Portfólio</h2>
          {selectedStatuses.length > 0 && (
             <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
               {selectedStatuses.length}
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

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={selectedStatuses.length > 0 ? "default" : "outline"} 
                size="icon" 
                className={cn(
                  "h-8 w-8 shrink-0",
                  selectedStatuses.length > 0 ? "bg-primary text-primary-foreground" : "bg-secondary/50 border-0 hover:bg-secondary"
                )}
                data-testid="btn-filter-status"
              >
                <Filter className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-xs">Status</h4>
                  {selectedStatuses.length > 0 && (
                    <button 
                      onClick={() => setSelectedStatuses([])}
                      className="text-[10px] text-muted-foreground hover:text-primary"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <div className="space-y-1">
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
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1.5">
          {filteredCities.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-xs">
              Vazio
            </div>
          ) : (
            filteredCities.map((city) => (
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
                <div className="flex justify-between items-center mb-0.5">
                  <div className="font-medium text-xs text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    <span className="truncate">{city.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">{city.state}</span>
                  </div>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0 rounded-full font-medium uppercase tracking-wider",
                    getStatusBadgeColor(city.currentStatus)
                  )}>
                    {city.currentStatus}
                  </span>
                </div>
              </button>
            ))
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
