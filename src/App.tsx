import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PersonaProvider } from "@/context/PersonaContext";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import SignLanguageModal from "./components/SignLanguageModal";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

const AppContent = () => {
  const [signOpen, setSignOpen] = useState(false);

  useEffect(() => {
    const handleSign = () => setSignOpen(true);
    const handleSOS = () => toast.error("SOS Alert sent to Station Police! Help is on the way.", { duration: 5000 });
    window.addEventListener("open-sign-modal", handleSign);
    window.addEventListener("open-sos", handleSOS);
    return () => {
      window.removeEventListener("open-sign-modal", handleSign);
      window.removeEventListener("open-sos", handleSOS);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Navbar />
      <SignLanguageModal open={signOpen} onClose={() => setSignOpen(false)} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PersonaProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PersonaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
