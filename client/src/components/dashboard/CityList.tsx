import * as React from "react";
import { City } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { MapPin, Users, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CityListProps {
  cities: City[];
  selectedCityId: string | null;
  onSelectCity: (cityId: string) => void;
}

export function CityList({ cities, selectedCityId, onSelectCity }: CityListProps) {
  const [search, setSearch] = React.useState("");

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(search.toLowerCase()) ||
    city.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-heading font-semibold mb-4">My Portfolio</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:bg-background transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-cities"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {filteredCities.map((city) => (
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
          ))}
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
