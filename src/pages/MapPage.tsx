import StationMap from "@/components/StationMap";
import PersonaSelector from "@/components/PersonaSelector";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="px-4 pt-4 pb-2 space-y-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            aria-label="Go back to home"
            className="p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display font-bold text-lg text-foreground">New Delhi Station</h1>
        </div>
        <PersonaSelector />
      </div>
      <div className="flex-1 relative">
        <StationMap />
      </div>
    </div>
  );
};

export default MapPage;
