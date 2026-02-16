import { useTrainSchedules } from "@/hooks/useSupabaseData";
import { usePersona } from "@/context/PersonaContext";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle, Loader2 } from "lucide-react";

const statusColor: Record<string, string> = {
  "On Time": "text-transit-green",
  Delayed: "text-transit-amber",
  Arrived: "text-transit-sky",
  Departed: "text-muted-foreground",
};

const TrainDashboard = () => {
  const { mode, selectedStation } = usePersona();
  const isLargeUI = mode === "accessible";
  const { data: trains = [], isLoading } = useTrainSchedules(selectedStation || "NDLS");

  return (
    <div id="trains" className="space-y-3">
      <h2 className={cn("font-display font-bold text-foreground", isLargeUI ? "text-2xl" : "text-lg")}>
        Live Departures — NDLS
      </h2>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className={cn("px-3 py-2.5 font-semibold text-muted-foreground", isLargeUI ? "text-base" : "text-xs")}>Train</th>
                <th className={cn("px-3 py-2.5 font-semibold text-muted-foreground", isLargeUI ? "text-base" : "text-xs")}>Pf</th>
                <th className={cn("px-3 py-2.5 font-semibold text-muted-foreground", isLargeUI ? "text-base" : "text-xs")}>Arr</th>
                <th className={cn("px-3 py-2.5 font-semibold text-muted-foreground", isLargeUI ? "text-base" : "text-xs")}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" /></td></tr>
              ) : trains.map((train) => (
                <tr key={train.number} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className={cn("px-3 py-3", isLargeUI && "py-4")}>
                    <p className={cn("font-medium text-foreground", isLargeUI ? "text-base" : "text-sm")}>{train.name}</p>
                    <p className="text-xs text-muted-foreground">#{train.number}</p>
                  </td>
                  <td className={cn("px-3 py-3 font-bold text-foreground", isLargeUI ? "text-lg" : "text-sm")}>{train.platform}</td>
                  <td className={cn("px-3 py-3 text-foreground", isLargeUI ? "text-base" : "text-sm")}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {train.arrival}
                    </div>
                  </td>
                  <td className={cn("px-3 py-3", isLargeUI ? "text-base" : "text-sm")}>
                    <span className={cn("font-medium flex items-center gap-1", statusColor[train.status])}>
                      {train.delay > 0 && <AlertTriangle className="w-3 h-3" />}
                      {train.status}
                      {train.delay > 0 && <span className="text-xs">+{train.delay}m</span>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainDashboard;
