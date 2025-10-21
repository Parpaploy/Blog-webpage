"use client";

import { ReactNode } from "react";
import { useSidebar } from "../../../../hooks/sidebar";
import { usePathname, useRouter } from "next/navigation";

export default function SidebarMenu({
  label,
  icon,
  path,
  isLongLabel = false,
}: {
  label: string;
  icon: ReactNode;
  path: string;
  isLongLabel?: boolean;
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
      className={`whitespace-nowrap max-h-15 ${
        isSidebar ? "w-full" : "w-auto"
      } group backdrop-blur-sm border border-white/30 border-l-0 border-r-0 shadow-md px-2 py-1.75 transition-all relative overflow-hidden
                      ${
                        isSidebar
                          ? "rounded-3xl w-full px-3 text-start"
                          : "rounded-3xl text-center w-10"
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
      {isSidebar ? (
        <div
          className={`transition-opacity duration-300 ${
            isSidebar ? "opacity-100 delay-1000" : "opacity-0"
          }`}
        >
          <div
            className={`flex items-stretch justify-start gap-5 ${
              isLongLabel && "!whitespace-normal"
            }`}
          >
            <div className="w-[10%]">{icon}</div>
            <div className="w-[90%]">{label}</div>
          </div>
        </div>
      ) : (
        <p className="flex items-center justify-center">{icon}</p>
      )}

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
