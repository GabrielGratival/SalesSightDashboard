import * as React from "react";
import { cn } from "@/lib/utils";
import { CRM_STATUSES, CRMStatus } from "@/lib/mockData";
import { Check } from "lucide-react";

interface StatusPipelineProps {
  currentStatus: CRMStatus;
  onStatusChange: (status: CRMStatus) => void;
}

export function StatusPipeline({ currentStatus, onStatusChange }: StatusPipelineProps) {
  const currentIndex = CRM_STATUSES.indexOf(currentStatus);

  const getStatusColor = (status: CRMStatus) => {
    switch (status) {
      case "Quero": return "bg-status-quero text-foreground";
      case "Devo": return "bg-status-devo text-foreground";
      case "Posso": return "bg-status-posso text-white";
      case "Quantitativo": return "bg-status-quantitativo text-white";
      case "Prefeito": return "bg-status-prefeito text-white";
      case "Contrato": return "bg-status-contrato text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-full overflow-hidden pb-2 pt-1">
      <div className="flex items-center justify-between w-full gap-0.5 md:gap-1">
        {CRM_STATUSES.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <React.Fragment key={status}>
              <button
                onClick={() => onStatusChange(status)}
                className={cn(
                  "group relative flex flex-col items-center gap-1.5 flex-1 min-w-0 transition-all duration-300 focus:outline-none",
                  isCurrent ? "scale-100" : "hover:scale-105 opacity-80 hover:opacity-100"
                )}
                data-testid={`status-step-${status}`}
              >
                <div 
                  className={cn(
                    "w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 border shrink-0",
                    isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                    isCurrent ? getStatusColor(status) + " border-current ring-2 ring-offset-1 ring-offset-background ring-primary/20" : 
                    "bg-muted border-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <span className="text-[10px] font-medium">{index + 1}</span>}
                </div>
                <span className={cn(
                  "text-[9px] md:text-[10px] font-medium text-center transition-colors leading-none truncate w-full px-0.5",
                  isCurrent ? "text-foreground font-bold" : "text-muted-foreground"
                )}>
                  {status}
                </span>
                
                {/* Active Indicator Line */}
                {isCurrent && (
                  <div className="absolute -bottom-1.5 w-full h-0.5 bg-primary/50 rounded-full animate-in fade-in zoom-in duration-300" />
                )}
              </button>
              
              {index < CRM_STATUSES.length - 1 && (
                <div className={cn(
                  "h-0.5 flex-1 transition-colors duration-500 mx-0.5 md:mx-1 shrink",
                  index < currentIndex ? "bg-primary" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
