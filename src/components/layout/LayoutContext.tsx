// src/components/layout/LayoutContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

type LayoutContextType = {
  collapsed: boolean;
  toggleSidebar: () => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleSidebar = () => setCollapsed(prev => !prev);

  return (
    <LayoutContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
};
