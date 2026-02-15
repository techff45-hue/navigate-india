import { useState, useMemo } from "react";
import { Search, MapPin } from "lucide-react";
import { stations } from "@/data/mockData";
import { usePersona } from "@/context/PersonaContext";
import { cn } from "@/lib/utils";

const StationSearch = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { setSelectedStation, mode } = usePersona();

  const filtered = useMemo(
    () =>
      stations.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const isLargeUI = mode === "accessible";

  return (
    <div className="relative w-full">
      <div className={cn(
        "flex items-center gap-3 bg-card border border-border rounded-xl px-4 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-accent/30",
        isLargeUI ? "py-4" : "py-3"
      )}>
        <Search className={cn("text-muted-foreground shrink-0", isLargeUI ? "w-6 h-6" : "w-5 h-5")} />
        <input
          type="text"
          placeholder="Search station (e.g., NDLS, Howrah)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-label="Search for a railway station"
          className={cn(
            "flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground",
            isLargeUI ? "text-lg" : "text-base"
          )}
        />
      </div>

      {open && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-4 text-muted-foreground text-sm text-center">No stations found</div>
          ) : (
            filtered.map((station) => (
              <button
                key={station.id}
                onClick={() => {
                  setSelectedStation(station.id);
                  setQuery(station.name);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 text-left hover:bg-muted transition-colors",
                  isLargeUI ? "py-4 min-h-[56px]" : "py-3"
                )}
              >
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <div>
                  <p className={cn("font-medium text-foreground", isLargeUI && "text-lg")}>{station.name}</p>
                  <p className="text-xs text-muted-foreground">{station.code}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StationSearch;
