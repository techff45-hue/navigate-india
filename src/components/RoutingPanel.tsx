import { useState } from "react";
import { ndlsFacilities, facilityIcons, Facility } from "@/data/mockData";
import { usePersona } from "@/context/PersonaContext";
import { allNodes } from "@/lib/pathfinding";
import { cn } from "@/lib/utils";
import { X, MapPin, Navigation, ChevronDown } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onRoute: (fromId: string, toId: string) => void;
}

const RoutingPanel = ({ open, onClose, onRoute }: Props) => {
  const { mode } = usePersona();
  const isLargeUI = mode === "accessible";

  const [fromId, setFromId] = useState<string>("wp_entrance");
  const [toId, setToId] = useState<string>("");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // All selectable locations
  const locations = allNodes.map((n) => ({
    id: n.id,
    label: n.label,
    icon: n.facility ? facilityIcons[n.facility.type] : "📍",
    accessible: n.facility?.accessible ?? true,
  })).filter((l) => {
    if (mode === "accessible" && !l.accessible) return false;
    return true;
  });

  const handleGo = () => {
    if (fromId && toId && fromId !== toId) {
      onRoute(fromId, toId);
      onClose();
    }
  };

  if (!open) return null;

  const modeLabels: Record<string, string> = {
    local: "Shortest path (stairs OK)",
    traveler: "Guided route with landmarks",
    accessible: "Ramp & elevator only — no stairs",
    deaf: "Visual waypoints highlighted",
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card rounded-t-2xl border-t border-border shadow-2xl animate-slide-up p-5 space-y-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-accent" />
            <h3 className={cn("font-display font-bold text-foreground", isLargeUI ? "text-xl" : "text-lg")}>
              Take me to...
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation panel"
            className="p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Persona routing mode indicator */}
        <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
          <span className="text-accent font-semibold">
            {mode === "local" ? "⚡" : mode === "traveler" ? "🌍" : mode === "accessible" ? "♿" : "👁️"}
          </span>
          {modeLabels[mode]}
        </div>

        {/* From selector */}
        <div className="space-y-1.5">
          <label className={cn("font-medium text-foreground", isLargeUI ? "text-base" : "text-sm")}>From</label>
          <div className="relative">
            <button
              onClick={() => { setFromOpen(!fromOpen); setToOpen(false); }}
              className={cn(
                "w-full flex items-center justify-between gap-2 bg-secondary rounded-xl px-4 border border-border transition-colors",
                isLargeUI ? "py-4 text-base min-h-[56px]" : "py-3 text-sm min-h-[44px]"
              )}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-transit-green shrink-0" />
                {locations.find((l) => l.id === fromId)?.label || "Select starting point"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {fromOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => { setFromId(loc.id); setFromOpen(false); }}
                    className={cn(
                      "w-full text-left flex items-center gap-2 px-4 hover:bg-muted transition-colors",
                      isLargeUI ? "py-3 text-base min-h-[48px]" : "py-2.5 text-sm",
                      fromId === loc.id && "bg-accent/10 text-accent"
                    )}
                  >
                    <span>{loc.icon}</span>
                    <span className="text-foreground">{loc.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* To selector */}
        <div className="space-y-1.5">
          <label className={cn("font-medium text-foreground", isLargeUI ? "text-base" : "text-sm")}>To</label>
          <div className="relative">
            <button
              onClick={() => { setToOpen(!toOpen); setFromOpen(false); }}
              className={cn(
                "w-full flex items-center justify-between gap-2 bg-secondary rounded-xl px-4 border border-border transition-colors",
                isLargeUI ? "py-4 text-base min-h-[56px]" : "py-3 text-sm min-h-[44px]"
              )}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-transit-red shrink-0" />
                {locations.find((l) => l.id === toId)?.label || "Select destination"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {toOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                {locations.filter((l) => l.id !== fromId).map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => { setToId(loc.id); setToOpen(false); }}
                    className={cn(
                      "w-full text-left flex items-center gap-2 px-4 hover:bg-muted transition-colors",
                      isLargeUI ? "py-3 text-base min-h-[48px]" : "py-2.5 text-sm",
                      toId === loc.id && "bg-accent/10 text-accent"
                    )}
                  >
                    <span>{loc.icon}</span>
                    <span className="text-foreground">{loc.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Go button */}
        <button
          onClick={handleGo}
          disabled={!fromId || !toId || fromId === toId}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-xl font-semibold transition-opacity",
            "bg-accent text-accent-foreground",
            (!fromId || !toId || fromId === toId) ? "opacity-40 cursor-not-allowed" : "hover:opacity-90",
            isLargeUI ? "py-4 text-lg min-h-[56px]" : "py-3 text-base min-h-[48px]"
          )}
          aria-label="Start navigation"
        >
          <Navigation className="w-5 h-5" />
          Navigate
        </button>
      </div>
    </div>
  );
};

export default RoutingPanel;
