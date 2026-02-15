import { Facility, ndlsFacilities, PersonaMode } from "@/data/mockData";

/**
 * Navigation graph for station pathfinding.
 * Each node is a facility or waypoint. Edges have distance and metadata
 * (hasStairs, hasRamp, hasElevator) so persona modes can filter routes.
 */

export interface NavNode {
  id: string;
  lat: number;
  lng: number;
  label: string;
  facility?: Facility;
}

export interface NavEdge {
  from: string;
  to: string;
  distance: number; // meters
  hasStairs: boolean;
  hasRamp: boolean;
  hasElevator: boolean;
}

// Build nav nodes from facilities + add waypoint nodes for realistic routing
const facilityNodes: NavNode[] = ndlsFacilities.map((f) => ({
  id: f.id,
  lat: f.lat,
  lng: f.lng,
  label: f.name,
  facility: f,
}));

// Add junction/waypoint nodes for realistic indoor paths
const waypointNodes: NavNode[] = [
  { id: "wp_entrance", lat: 28.6428, lng: 77.2189, label: "Main Entrance" },
  { id: "wp_overbridge", lat: 28.6427, lng: 77.2196, label: "Foot Overbridge" },
  { id: "wp_concourse", lat: 28.6429, lng: 77.2193, label: "Main Concourse" },
  { id: "wp_south", lat: 28.6424, lng: 77.2192, label: "South Corridor" },
  { id: "wp_north", lat: 28.6432, lng: 77.2193, label: "North Wing" },
];

export const allNodes: NavNode[] = [...facilityNodes, ...waypointNodes];

// Edges model the station's internal pathways
// hasStairs=true means this edge uses stairs (excluded in accessible mode)
// hasRamp/hasElevator=true means accessible alternatives exist
export const edges: NavEdge[] = [
  // Main entrance connections
  { from: "wp_entrance", to: "hd1", distance: 15, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_entrance", to: "r1", distance: 20, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_entrance", to: "wp_concourse", distance: 30, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_entrance", to: "rmp1", distance: 10, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_entrance", to: "f1", distance: 25, hasStairs: false, hasRamp: true, hasElevator: false },

  // Concourse is the central hub
  { from: "wp_concourse", to: "a1", distance: 35, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_concourse", to: "f2", distance: 40, hasStairs: true, hasRamp: false, hasElevator: true },
  { from: "wp_concourse", to: "wp_overbridge", distance: 25, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_concourse", to: "wp_north", distance: 30, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_concourse", to: "wp_south", distance: 35, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_concourse", to: "e1", distance: 15, hasStairs: false, hasRamp: true, hasElevator: true },
  { from: "wp_concourse", to: "b1", distance: 28, hasStairs: false, hasRamp: true, hasElevator: false },

  // Overbridge connects platforms (stairs or elevator)
  { from: "wp_overbridge", to: "p1", distance: 20, hasStairs: true, hasRamp: false, hasElevator: false },
  { from: "wp_overbridge", to: "p2", distance: 15, hasStairs: true, hasRamp: false, hasElevator: false },
  { from: "wp_overbridge", to: "p3", distance: 25, hasStairs: true, hasRamp: false, hasElevator: false },
  { from: "wp_overbridge", to: "e1", distance: 10, hasStairs: false, hasRamp: false, hasElevator: true },

  // Elevator provides accessible platform access
  { from: "e1", to: "p1", distance: 25, hasStairs: false, hasRamp: true, hasElevator: true },
  { from: "e1", to: "p2", distance: 20, hasStairs: false, hasRamp: true, hasElevator: true },
  { from: "e1", to: "p3", distance: 30, hasStairs: false, hasRamp: true, hasElevator: true },

  // Ramp connects to platforms on ground level
  { from: "rmp1", to: "p4", distance: 30, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "rmp1", to: "p1", distance: 35, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "rmp1", to: "wp_south", distance: 20, hasStairs: false, hasRamp: true, hasElevator: false },

  // South corridor
  { from: "wp_south", to: "p4", distance: 15, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_south", to: "p5", distance: 25, hasStairs: true, hasRamp: false, hasElevator: false },
  { from: "wp_south", to: "r2", distance: 30, hasStairs: false, hasRamp: true, hasElevator: false },

  // North wing
  { from: "wp_north", to: "w1", distance: 20, hasStairs: true, hasRamp: false, hasElevator: true },
  { from: "wp_north", to: "a1", distance: 15, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_north", to: "b1", distance: 18, hasStairs: false, hasRamp: true, hasElevator: false },
  { from: "wp_north", to: "f2", distance: 22, hasStairs: true, hasRamp: false, hasElevator: true },

  // Direct platform-to-platform via overbridge stairs
  { from: "p1", to: "p2", distance: 40, hasStairs: true, hasRamp: false, hasElevator: false },
  { from: "p2", to: "p3", distance: 35, hasStairs: true, hasRamp: false, hasElevator: false },
  { from: "p3", to: "r2", distance: 15, hasStairs: false, hasRamp: true, hasElevator: false },
];

/**
 * Dijkstra pathfinding with persona-aware edge filtering
 */
export function findRoute(
  fromId: string,
  toId: string,
  persona: PersonaMode
): { path: NavNode[]; distance: number; viaElevator: boolean; viaRamp: boolean; restPoints: NavNode[] } | null {
  // Filter edges based on persona
  const availableEdges = edges.filter((e) => {
    if (persona === "accessible") {
      // Exclude edges that ONLY have stairs (no ramp or elevator alternative)
      if (e.hasStairs && !e.hasRamp && !e.hasElevator) return false;
    }
    return true;
  });

  // Build adjacency list
  const adj: Record<string, { to: string; dist: number; edge: NavEdge }[]> = {};
  for (const node of allNodes) adj[node.id] = [];
  for (const edge of availableEdges) {
    adj[edge.from]?.push({ to: edge.to, dist: edge.distance, edge });
    adj[edge.to]?.push({ to: edge.from, dist: edge.distance, edge });
  }

  // Dijkstra
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const edgeUsed: Record<string, NavEdge | null> = {};
  const visited = new Set<string>();

  for (const node of allNodes) {
    dist[node.id] = Infinity;
    prev[node.id] = null;
    edgeUsed[node.id] = null;
  }
  dist[fromId] = 0;

  while (true) {
    let u: string | null = null;
    let minDist = Infinity;
    for (const node of allNodes) {
      if (!visited.has(node.id) && dist[node.id] < minDist) {
        u = node.id;
        minDist = dist[node.id];
      }
    }
    if (u === null || u === toId) break;
    visited.add(u);

    for (const neighbor of adj[u] || []) {
      const alt = dist[u] + neighbor.dist;
      if (alt < dist[neighbor.to]) {
        dist[neighbor.to] = alt;
        prev[neighbor.to] = u;
        edgeUsed[neighbor.to] = neighbor.edge;
      }
    }
  }

  if (dist[toId] === Infinity) return null;

  // Reconstruct path
  const pathIds: string[] = [];
  let current: string | null = toId;
  while (current) {
    pathIds.unshift(current);
    current = prev[current];
  }

  const nodeMap = new Map(allNodes.map((n) => [n.id, n]));
  const path = pathIds.map((id) => nodeMap.get(id)!).filter(Boolean);

  // Check if route uses elevator or ramp
  let viaElevator = false;
  let viaRamp = false;
  for (const id of pathIds) {
    const edge = edgeUsed[id];
    if (edge?.hasElevator) viaElevator = true;
    if (edge?.hasRamp) viaRamp = true;
  }

  // Find rest points along the route (benches, waiting rooms)
  const restPoints = path.filter(
    (n) => n.facility && (n.facility.type === "bench" || n.facility.type === "waiting")
  );

  return { path, distance: dist[toId], viaElevator, viaRamp, restPoints };
}

/**
 * Generate turn-by-turn directions from a path
 */
export function getDirections(path: NavNode[]): string[] {
  if (path.length < 2) return ["You are already at your destination"];

  const directions: string[] = [];
  directions.push(`Start at ${path[0].label}`);

  for (let i = 1; i < path.length; i++) {
    const from = path[i - 1];
    const to = path[i];
    const dx = to.lng - from.lng;
    const dy = to.lat - from.lat;

    let bearing = "";
    if (Math.abs(dy) > Math.abs(dx)) {
      bearing = dy > 0 ? "north" : "south";
    } else {
      bearing = dx > 0 ? "east" : "west";
    }

    const dist = Math.round(
      Math.sqrt(Math.pow((to.lat - from.lat) * 111000, 2) + Math.pow((to.lng - from.lng) * 111000 * Math.cos(from.lat * Math.PI / 180), 2))
    );

    if (to.facility) {
      if (to.facility.type === "elevator") {
        directions.push(`Take the elevator (${dist}m ${bearing})`);
      } else if (to.facility.type === "ramp") {
        directions.push(`Use the ramp (${dist}m ${bearing})`);
      } else if (i === path.length - 1) {
        directions.push(`Arrive at ${to.label} (${dist}m ${bearing})`);
      } else {
        directions.push(`Pass ${to.label} (${dist}m ${bearing})`);
      }
    } else {
      directions.push(`Walk ${bearing} through ${to.label} (~${dist}m)`);
    }
  }

  return directions;
}
