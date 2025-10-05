"use client";

import { useSidebar } from "../../../../hooks/sidebar";
import "../../globals.css";

export default function Loading() {
  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-[93svh] flex items-center justify-center ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <div className="loader">
        <div style={{ "--i": 1 } as React.CSSProperties}></div>
        <div style={{ "--i": 2 } as React.CSSProperties}></div>
        <div style={{ "--i": 3 } as React.CSSProperties}></div>
        <div style={{ "--i": 4 } as React.CSSProperties}></div>
      </div>
    </main>
  );
}
