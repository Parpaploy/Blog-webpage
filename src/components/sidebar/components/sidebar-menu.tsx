"use client";

import { ReactNode } from "react";
import { useSidebar } from "../../../../hooks/sidebar";
import { usePathname } from "next/navigation";

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

  const thisPath = usePathname();

  return (
    <a
      href={path}
      className={`${isSidebar ? "w-full" : "w-auto"} transition-all group`}
    >
      <button
        type="submit"
        className={`backdrop-blur-sm border border-white/30 border-l-0 border-r-0 shadow-lg p-2 cursor-pointer transition-all relative
                    ${isSidebar ? "rounded-2xl" : "rounded-full"} 
                    ${
                      isSidebar ? "w-full px-3 text-start" : "text-center w-11"
                    } 
                    ${
                      thisPath === path
                        ? "bg-white/40 text-white"
                        : "text-black hover:text-white/50 hover:bg-white/10"
                    }
                      ${thisPath === path && isSidebar && "rounded-r-sm"}
                      ${
                        thisPath !== path &&
                        isSidebar &&
                        "group-hover:rounded-r-sm"
                      }`}
      >
        {isSidebar ? longTitle : shortTitle}
        <div
          className={`absolute w-1 h-full ${
            thisPath === path
              ? "bg-white/60 backdrop-blur-sm border border-white/30 border-l-0 shadow-lg"
              : "bg-transparent group-hover:bg-white/30 group-hover:backdrop-blur-sm group-hover:border group-hover:border-white/30 group-hover:border-l-0 group-hover:shadow-lg"
          } top-0 ${
            isSidebar ? "right-0" : "-right-2"
          } rounded-4xl transition-all`}
        />
      </button>
    </a>
  );
}
