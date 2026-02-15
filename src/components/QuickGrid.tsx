import { Train, Map, UtensilsCrossed, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePersona } from "@/context/PersonaContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const items = [
  { icon: Train, label: "Live Trains", desc: "Status & platforms", path: "#trains", color: "bg-transit-navy text-primary-foreground" },
  { icon: Map, label: "Station Map", desc: "Navigate facilities", path: "/map", color: "bg-transit-saffron text-accent-foreground" },
  { icon: UtensilsCrossed, label: "Facilities", desc: "Food, ATM & more", path: "/map?filter=food", color: "bg-transit-green text-accent-foreground" },
  { icon: ShieldAlert, label: "Emergency", desc: "SOS & Help Desk", path: "/map?filter=helpdesk", color: "bg-transit-red text-accent-foreground" },
];

const QuickGrid = () => {
  const navigate = useNavigate();
  const { mode } = usePersona();
  const isLargeUI = mode === "accessible";

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <motion.button
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          onClick={() => {
            if (item.path.startsWith("#")) {
              document.getElementById("trains")?.scrollIntoView({ behavior: "smooth" });
            } else {
              navigate(item.path);
            }
          }}
          aria-label={`${item.label}: ${item.desc}`}
          className={cn(
            "flex flex-col items-start gap-2 rounded-xl p-4 transition-transform hover:scale-[1.02] active:scale-[0.98]",
            item.color,
            isLargeUI && "p-5 min-h-[100px]"
          )}
        >
          <item.icon className={cn("w-6 h-6", isLargeUI && "w-8 h-8")} />
          <div className="text-left">
            <p className={cn("font-semibold", isLargeUI ? "text-lg" : "text-sm")}>{item.label}</p>
            <p className={cn("opacity-80", isLargeUI ? "text-sm" : "text-xs")}>{item.desc}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickGrid;
