import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { ndlsFacilities, facilityIcons, Facility } from "@/data/mockData";
import { usePersona } from "@/context/PersonaContext";
import FacilitySheet from "./FacilitySheet";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

const createFacilityIcon = (type: Facility["type"]) => {
  return L.divIcon({
    html: `<div style="font-size:22px;display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:white;border-radius:50%;border:2px solid #FF6B00;box-shadow:0 2px 8px rgba(0,0,0,0.15);">${facilityIcons[type]}</div>`,
    className: "custom-facility-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const StationMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Facility | null>(null);
  const [searchParams] = useSearchParams();
  const { mode } = usePersona();
  const isLargeUI = mode === "accessible";
  const filter = searchParams.get("filter");

  const facilities = ndlsFacilities.filter((f) => {
    if (mode === "accessible" && !f.accessible) return false;
    if (filter === "food") return f.type === "food" || f.type === "atm";
    if (filter === "helpdesk") return f.type === "helpdesk";
    return true;
  });

  const center: [number, number] = [28.6427, 77.2193];

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    // Add facility markers
    facilities.forEach((f) => {
      const marker = L.marker([f.lat, f.lng], { icon: createFacilityIcon(f.type) });
      marker.addTo(map);
      marker.on("click", () => setSelected(f));
      marker.bindTooltip(f.name, { direction: "top", offset: [0, -20] });
    });
  }, [facilities, mode, filter]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full rounded-xl z-0" />

      <button
        className={cn(
          "absolute bottom-24 right-4 z-[500] bg-accent text-accent-foreground rounded-full shadow-lg flex items-center gap-2 font-semibold animate-pulse-saffron",
          isLargeUI ? "px-6 py-4 text-lg" : "px-4 py-3 text-sm"
        )}
        aria-label="Navigate to a facility"
      >
        <Navigation className={cn(isLargeUI ? "w-6 h-6" : "w-5 h-5")} />
        Take me to...
      </button>

      <FacilitySheet facility={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default StationMap;
