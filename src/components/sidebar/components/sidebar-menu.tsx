"use client";

import { ReactNode } from "react";
import { useSidebar } from "../../../hooks/sidebar";

export default function SidebarMenu({
  shortTitle,
  longTitle,
}: {
  shortTitle: ReactNode;
  longTitle: ReactNode;
}) {
  const { isSidebar } = useSidebar();

  return (
    <button
      type="submit"
      className={`rounded-lg bg-red-400 p-2 cursor-pointer transition-all h-10 ${
        isSidebar ? "w-full px-3" : "w-10"
      }`}
    >
      {isSidebar ? longTitle : shortTitle}
    </button>
  );
}
