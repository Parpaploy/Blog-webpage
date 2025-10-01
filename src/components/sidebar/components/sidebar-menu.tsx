"use client";

import { ReactNode } from "react";
import { useSidebar } from "../../../../hooks/sidebar";

export default function SidebarMenu({
  shortTitle,
  longTitle,
  path,
}: {
  shortTitle: ReactNode;
  longTitle: ReactNode;
  path: string;
}) {
  const { isSidebar } = useSidebar();

  return (
    <a
      href={path}
      className={`${isSidebar ? "w-full" : "w-auto"} transition-all`}
    >
      <button
        type="submit"
        className={`${
          isSidebar ? "rounded-lg" : "rounded-full"
        } bg-red-400 p-2 cursor-pointer transition-all ${
          isSidebar ? "w-full px-3 text-start" : "text-center w-10"
        }`}
      >
        {isSidebar ? longTitle : shortTitle}
      </button>
    </a>
  );
}
