"use client";

import { useSidebar } from "../../hooks/sidebar";

export default function NotFound() {
  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-[93svh] text-center p-10 ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <h1 className="font-bold mb-4 text-3xl">404 - Page Not Found</h1>
      <p className="mb-6">We couldn't find the page you were looking for...</p>
    </main>
  );
}
