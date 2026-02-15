import { usePersona } from "@/context/PersonaContext";
import { PersonaMode } from "@/data/mockData";
import { Zap, Globe, Accessibility, Ear } from "lucide-react";
import { cn } from "@/lib/utils";

const personas: { mode: PersonaMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { mode: "local", label: "Local", icon: <Zap className="w-5 h-5" />, desc: "Speed-first navigation" },
  { mode: "traveler", label: "Traveler", icon: <Globe className="w-5 h-5" />, desc: "Guided experience" },
  { mode: "accessible", label: "Accessible", icon: <Accessibility className="w-5 h-5" />, desc: "Ramp-only routes" },
  { mode: "deaf", label: "Visual", icon: <Ear className="w-5 h-5" />, desc: "Visual cues mode" },
];

const PersonaSelector = () => {
  const { mode, setMode } = usePersona();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {personas.map((p) => (
        <button
          key={p.mode}
          onClick={() => setMode(p.mode)}
          aria-label={`Switch to ${p.label} mode: ${p.desc}`}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all min-h-[44px]",
            mode === p.mode
              ? "bg-accent text-accent-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {p.icon}
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PersonaSelector;
