import * as React from "react";
import { useLocation } from "wouter";
import { mockCities, mockSalesReps, City, CRMStatus, Interaction } from "@/lib/mockData";
import { CityList } from "@/components/dashboard/CityList";
import { StatusPipeline } from "@/components/dashboard/StatusPipeline";
import { Timeline } from "@/components/dashboard/Timeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Calendar, User, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [cities, setCities] = React.useState<City[]>(mockCities);
  const [selectedCityId, setSelectedCityId] = React.useState<string | null>(cities[0]?.id || null);
  const currentUser = mockSalesReps[0]; // Mock logged in user

  const selectedCity = React.useMemo(
    () => cities.find(c => c.id === selectedCityId), 
    [cities, selectedCityId]
  );

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
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg leading-none text-foreground">GovCRM</h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Commercial Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">Sales Representative</p>
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
        <aside className="w-[350px] shrink-0 hidden md:block h-full">
          <CityList 
            cities={cities} 
            selectedCityId={selectedCityId} 
            onSelectCity={setSelectedCityId} 
          />
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col min-w-0 bg-background relative">
          {selectedCity ? (
            <>
              {/* City Header & Context */}
              <div className="p-6 pb-2 bg-card border-b border-border shadow-sm z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-heading font-bold text-foreground mb-1 tracking-tight">
                      {selectedCity.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {selectedCity.state}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" /> {(selectedCity.population / 1000).toFixed(1)}k inhabitants
                      </span>
                      {selectedCity.lastVisit && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="flex items-center gap-1.5 text-orange-600/80">
                            <Calendar className="w-4 h-4" /> Last visit: {format(selectedCity.lastVisit, "MMM d, yyyy")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 px-4 py-2 rounded-lg border border-border/50">
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                       Next Action
                     </span>
                     <span className="font-medium text-foreground">
                       {selectedCity.nextAction || "No action scheduled"}
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
              Select a city to view details
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
