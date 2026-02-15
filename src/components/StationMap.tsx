import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { ndlsFacilities, facilityIcons, Facility } from "@/data/mockData";
import { usePersona } from "@/context/PersonaContext";
import { findRoute, getDirections, NavNode } from "@/lib/pathfinding";
import FacilitySheet from "./FacilitySheet";
import RoutingPanel from "./RoutingPanel";
import RouteDirections from "./RouteDirections";
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
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);

  const [selected, setSelected] = useState<Facility | null>(null);
  const [routingOpen, setRoutingOpen] = useState(false);
  const [routeResult, setRouteResult] = useState<{
    directions: string[];
    distance: number;
    viaElevator: boolean;
    viaRamp: boolean;
    restPoints: NavNode[];
    path: NavNode[];
  } | null>(null);

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

  // Add facility markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    facilities.forEach((f) => {
      const marker = L.marker([f.lat, f.lng], { icon: createFacilityIcon(f.type) });
      marker.addTo(map);
      marker.on("click", () => setSelected(f));
      marker.bindTooltip(f.name, { direction: "top", offset: [0, -20] });
    });

    // Re-add route markers if they exist
    if (startMarkerRef.current) startMarkerRef.current.addTo(map);
    if (endMarkerRef.current) endMarkerRef.current.addTo(map);
  }, [facilities, mode, filter]);

  const clearRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current);
      endMarkerRef.current = null;
    }
    setRouteResult(null);
  }, []);

  const handleRoute = useCallback((fromId: string, toId: string) => {
    const map = mapRef.current;
    if (!map) return;

    clearRoute();

    const result = findRoute(fromId, toId, mode);
    if (!result) {
      // No route found — could show a toast
      return;
    }

    const directions = getDirections(result.path);
    setRouteResult({
      directions,
      distance: result.distance,
      viaElevator: result.viaElevator,
      viaRamp: result.viaRamp,
      restPoints: result.restPoints,
      path: result.path,
    });

    // Draw polyline
    const routeColor = mode === "accessible" ? "#22A06B" : "#FF6B00";
    const latlngs: [number, number][] = result.path.map((n) => [n.lat, n.lng]);
    const polyline = L.polyline(latlngs, {
      color: routeColor,
      weight: 5,
      opacity: 0.85,
      dashArray: mode === "accessible" ? undefined : "8, 12",
      lineCap: "round",
      lineJoin: "round",
    });
    polyline.addTo(map);
    routeLayerRef.current = polyline;

    // Start marker (green)
    const startIcon = L.divIcon({
      html: `<div style="width:28px;height:28px;background:#22A06B;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;">A</div>`,
      className: "route-marker",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const start = L.marker([result.path[0].lat, result.path[0].lng], { icon: startIcon });
    start.addTo(map);
    startMarkerRef.current = start;

    // End marker (saffron)
    const endIcon = L.divIcon({
      html: `<div style="width:28px;height:28px;background:#FF6B00;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;">B</div>`,
      className: "route-marker",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const end = L.marker([result.path[result.path.length - 1].lat, result.path[result.path.length - 1].lng], { icon: endIcon });
    end.addTo(map);
    endMarkerRef.current = end;

    // Fit bounds
    map.fitBounds(polyline.getBounds().pad(0.3));
  }, [mode, clearRoute]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full rounded-xl z-0" />

      {/* Route directions overlay */}
      {routeResult && (
        <RouteDirections
          directions={routeResult.directions}
          distance={routeResult.distance}
          viaElevator={routeResult.viaElevator}
          viaRamp={routeResult.viaRamp}
          restPoints={routeResult.restPoints}
          onClose={clearRoute}
        />
      )}

      {/* Take me to button */}
      {!routeResult && (
        <button
          onClick={() => setRoutingOpen(true)}
          className={cn(
            "absolute bottom-24 right-4 z-[500] bg-accent text-accent-foreground rounded-full shadow-lg flex items-center gap-2 font-semibold animate-pulse-saffron",
            isLargeUI ? "px-6 py-4 text-lg" : "px-4 py-3 text-sm"
          )}
          aria-label="Navigate to a facility"
        >
          <Navigation className={cn(isLargeUI ? "w-6 h-6" : "w-5 h-5")} />
          Take me to...
        </button>
      )}

      {/* Routing panel */}
      <RoutingPanel
        open={routingOpen}
        onClose={() => setRoutingOpen(false)}
        onRoute={handleRoute}
      />

      {/* Facility sheet */}
      <FacilitySheet facility={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default StationMap;
