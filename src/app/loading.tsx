"use client";

import { useSidebar } from "../../hooks/sidebar";
import "./globals.css";

export default function GlobalLoading() {
  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-screen fixed left-0 h-full ${
        isSidebar && "pl-25"
      } transition-all 
      flex items-center justify-center`}
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
