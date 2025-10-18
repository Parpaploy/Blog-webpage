"use client";

import { ReactNode } from "react";
import { useSidebar } from "../../../../hooks/sidebar";
import { usePathname, useRouter } from "next/navigation";

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

  const router = useRouter();

  return (
    <button
      type="submit"
      onClick={() => {
        if (thisPath !== path) {
          router.push(path);
        }
      }}
      className={`${
        isSidebar ? "w-full" : "w-auto"
      } group backdrop-blur-sm border border-white/30 border-l-0 border-r-0 shadow-md p-2 transition-all relative
                    ${isSidebar ? "rounded-2xl" : "rounded-full"} 
                    ${
                      isSidebar ? "w-full px-3 text-start" : "text-center w-11"
                    } 
                    ${
                      thisPath === path
                        ? "bg-white/40 text-white"
                        : "text-white/50 hover:text-white/70 hover:bg-white/20 cursor-pointer"
                    }
                      ${thisPath === path && isSidebar && "rounded-r-sm"}
                      ${
                        thisPath !== path && isSidebar && "hover:rounded-r-sm"
                      }`}
    >
      {isSidebar ? longTitle : shortTitle}
      <div
        className={`absolute w-1 h-full ${
          thisPath === path
            ? "bg-white/60 backdrop-blur-sm border border-white/30 border-l-0 shadow-md"
            : "bg-transparent group-hover:bg-white/30 group-hover:backdrop-blur-sm group-hover:border group-hover:border-white/30 group-hover:border-l-0 group-hover:shadow-md"
        } top-0 ${
          isSidebar ? "right-0" : "-right-2"
        } rounded-4xl transition-all`}
      />
    </button>
  );
}
