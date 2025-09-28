"use client";

import { useSidebar } from "../../hooks/sidebar";

export default function GlobalLoading() {
  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-[93svh] flex items-center justify-center ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <div className="text-xl animate-pulse text-gray-500">Loading...</div>
    </main>
  );
}
