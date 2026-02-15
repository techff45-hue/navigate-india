import { NavNode } from "@/lib/pathfinding";
import { usePersona } from "@/context/PersonaContext";
import { cn } from "@/lib/utils";
import { X, Clock, Footprints, ArrowRight, Accessibility, Eye, MapPin, Armchair } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  directions: string[];
  distance: number;
  viaElevator: boolean;
  viaRamp: boolean;
  restPoints: NavNode[];
  onClose: () => void;
}

const RouteDirections = ({ directions, distance, viaElevator, viaRamp, restPoints, onClose }: Props) => {
  const { mode } = usePersona();
  const isLargeUI = mode === "accessible";
  const walkTime = Math.max(1, Math.round(distance / 60)); // ~60m/min walking

  return (
    <div className="absolute top-0 left-0 right-0 z-[500] max-h-[50%] overflow-y-auto">
      <div className="m-3 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl">
        {/* Summary */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn("font-display font-bold text-foreground", isLargeUI ? "text-lg" : "text-base")}>Route</h3>
            <button
              onClick={onClose}
              aria-label="Close route directions"
              className="p-1.5 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-foreground font-medium">
              <Footprints className="w-4 h-4 text-accent" />
              {distance}m
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              ~{walkTime} min
            </span>
            {viaElevator && (
              <span className="flex items-center gap-1 text-transit-sky text-xs font-medium">
                🛗 Elevator
              </span>
            )}
            {viaRamp && (
              <span className="flex items-center gap-1 text-transit-green text-xs font-medium">
                ♿ Ramp
              </span>
            )}
          </div>

          {mode === "accessible" && restPoints.length > 0 && (
            <div className="mt-2 bg-transit-sky/10 rounded-lg px-3 py-2 text-xs text-transit-sky flex items-center gap-2">
              <Armchair className="w-4 h-4 shrink-0" />
              {restPoints.length} rest point{restPoints.length > 1 ? "s" : ""} along route: {restPoints.map((r) => r.label).join(", ")}
            </div>
          )}
        </div>

        {/* Step-by-step */}
        <div className="p-4 space-y-2">
          {directions.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "flex items-start gap-3",
                isLargeUI ? "text-base" : "text-sm"
              )}
            >
              <div className={cn(
                "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5",
                i === 0 ? "bg-transit-green text-accent-foreground" :
                i === directions.length - 1 ? "bg-accent text-accent-foreground" :
                "bg-muted text-muted-foreground"
              )}>
                {i === 0 ? "A" : i === directions.length - 1 ? "B" : i}
              </div>
              <p className="text-foreground leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteDirections;
