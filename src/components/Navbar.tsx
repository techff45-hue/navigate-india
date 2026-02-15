import { usePersona } from "@/context/PersonaContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Map, HandMetal, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { mode } = usePersona();
  const navigate = useNavigate();
  const location = useLocation();
  const isLargeUI = mode === "accessible";

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Map", path: "/map" },
    ...(mode === "deaf" ? [{ icon: HandMetal, label: "Sign", path: "/sign" }] : []),
    { icon: AlertTriangle, label: "SOS", path: "/sos" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                if (item.path === "/sign") {
                  // handled via state in parent
                  window.dispatchEvent(new CustomEvent("open-sign-modal"));
                } else if (item.path === "/sos") {
                  window.dispatchEvent(new CustomEvent("open-sos"));
                } else {
                  navigate(item.path);
                }
              }}
              aria-label={item.label}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 transition-colors min-h-[56px] min-w-[56px]",
                active ? "text-accent" : "text-muted-foreground hover:text-foreground",
                isLargeUI && "py-3 px-5"
              )}
            >
              <item.icon className={cn(isLargeUI ? "w-7 h-7" : "w-5 h-5")} />
              <span className={cn("font-medium", isLargeUI ? "text-sm" : "text-[10px]")}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
