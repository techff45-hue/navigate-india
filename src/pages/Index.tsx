import PersonaSelector from "@/components/PersonaSelector";
import StationSearch from "@/components/StationSearch";
import QuickGrid from "@/components/QuickGrid";
import TrainDashboard from "@/components/TrainDashboard";
import heroBg from "@/assets/hero-bg.jpg";
import { usePersona } from "@/context/PersonaContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrainFront } from "lucide-react";

const Index = () => {
  const { mode } = usePersona();
  const isLargeUI = mode === "accessible";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="transit-gradient relative">
          <div className="max-w-lg mx-auto px-4 pt-10 pb-8 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <TrainFront className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className={cn("font-display font-bold text-primary-foreground", isLargeUI ? "text-2xl" : "text-xl")}>
                  NavRail India
                </h1>
                <p className="text-primary-foreground/70 text-xs">Smart Station Navigator</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className={cn("text-primary-foreground/90 font-medium", isLargeUI ? "text-xl" : "text-base")}
            >
              Find Platforms, Food, & Toilets Instantly.
            </motion.p>

            <StationSearch />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 space-y-6 mt-6">
        <PersonaSelector />
        <QuickGrid />
        <TrainDashboard />
      </div>
    </div>
  );
};

export default Index;
