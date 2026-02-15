import React, { createContext, useContext, useState, ReactNode } from "react";
import { PersonaMode } from "@/data/mockData";

interface PersonaContextType {
  mode: PersonaMode;
  setMode: (mode: PersonaMode) => void;
  selectedStation: string;
  setSelectedStation: (id: string) => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PersonaMode>("local");
  const [selectedStation, setSelectedStation] = useState("ndls");

  return (
    <PersonaContext.Provider value={{ mode, setMode, selectedStation, setSelectedStation }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersona = () => {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
};
