import * as React from "react";
import { City, CRM_STATUSES, CRMStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { MapPin, Users, ChevronRight, Search, Filter, X } from "lucide-react";
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
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold">My Portfolio</h2>
          {selectedStatuses.length > 0 && (
             <Badge variant="secondary" className="text-xs font-normal">
               {selectedStatuses.length} filter{selectedStatuses.length > 1 ? 's' : ''} active
             </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cities..."
              className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:bg-background transition-colors h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-cities"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={selectedStatuses.length > 0 ? "default" : "outline"} 
                size="icon" 
                className={cn(
                  "h-9 w-9 shrink-0",
                  selectedStatuses.length > 0 ? "bg-primary text-primary-foreground" : "bg-secondary/50 border-0 hover:bg-secondary"
                )}
                data-testid="btn-filter-status"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Filter by Status</h4>
                  {selectedStatuses.length > 0 && (
                    <button 
                      onClick={() => setSelectedStatuses([])}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {CRM_STATUSES.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`filter-${status}`} 
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                      />
                      <Label 
                        htmlFor={`filter-${status}`}
                        className="text-sm font-normal cursor-pointer flex-1"
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
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {filteredCities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No cities found matching your filters.
              {(selectedStatuses.length > 0 || search) && (
                <button 
                  onClick={clearFilters}
                  className="block mx-auto mt-2 text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all duration-200 group",
                  selectedCityId === city.id 
                    ? "bg-primary/5 border-primary/20 shadow-sm" 
                    : "bg-card border-transparent hover:bg-secondary hover:border-border"
                )}
                data-testid={`city-card-${city.id}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {city.name}
                  </div>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
                    getStatusBadgeColor(city.currentStatus)
                  )}>
                    {city.currentStatus}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {city.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {(city.population / 1000).toFixed(1)}k
                  </div>
                </div>

                {city.nextAction && (
                  <div className="text-xs text-muted-foreground bg-muted/50 p-1.5 rounded-md mt-2 truncate">
                    <span className="font-medium text-foreground/80">Next:</span> {city.nextAction}
                  </div>
                )}
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
