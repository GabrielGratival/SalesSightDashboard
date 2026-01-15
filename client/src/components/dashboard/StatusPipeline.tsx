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
    <div className="w-full overflow-hidden py-1.5">
      <div className="flex items-center justify-between w-full gap-1">
        {CRM_STATUSES.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <React.Fragment key={status}>
              <button
                onClick={() => onStatusChange(status)}
                className={cn(
                  "group relative flex flex-col items-center gap-1 flex-1 min-w-0 transition-all duration-200 focus:outline-none",
                  isCurrent ? "scale-100" : "hover:opacity-100 opacity-70"
                )}
                data-testid={`status-step-${status}`}
              >
                <div 
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 relative z-10",
                    isCompleted ? "bg-primary/10 border border-primary/30" : 
                    isCurrent ? getStatusColor(status) + " border-2 border-current shadow-sm" : 
                    "bg-muted/50 border border-border"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                  ) : (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isCurrent ? "bg-white" : "bg-muted-foreground/40"
                    )} />
                  )}
                </div>
                <span className={cn(
                  "text-[9px] font-medium text-center transition-colors leading-tight truncate w-full px-0.5",
                  isCurrent ? "text-foreground font-semibold" : "text-muted-foreground"
                )}>
                  {status.length > 8 ? status.substring(0, 6) + "..." : status}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
