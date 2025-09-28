"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext<{
  isSidebar: boolean;
  toggleSidebar: () => void;
}>({
  isSidebar: false,
  toggleSidebar: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebar, setIsSidebar] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("isSidebar");
    if (stored !== null) setIsSidebar(stored === "true");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("isSidebar", isSidebar.toString());
    }
  }, [isSidebar, hydrated]);

  const toggleSidebar = () => setIsSidebar((v) => !v);

  if (!hydrated) return null;

  return (
    <SidebarContext.Provider value={{ isSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
