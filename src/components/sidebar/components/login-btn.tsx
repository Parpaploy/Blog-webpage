"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSidebar } from "../../../../hooks/sidebar";

export default function LoginButton({
  isLoggedIn,
  path,
  shortTitle,
  longTitle,
}: {
  isLoggedIn: boolean;
  path: string;
  shortTitle: ReactNode;
  longTitle: ReactNode;
}) {
  const currentPath = usePathname();

  const { isSidebar } = useSidebar();

  return (
    <>
      {!isLoggedIn && (
        <a
          href={path}
          className={`${isSidebar ? "w-full" : "w-auto"} transition-all`}
        >
          <button
            type="submit"
            className={`  ${
              isSidebar ? "rounded-2xl" : "rounded-full"
            }  p-2 cursor-pointer bg-white/10 border border-white/30 border-l-0 shadow-lg transition-all h-10 ${
              isSidebar ? "w-full px-3" : "w-10"
            } ${
              currentPath === "/login"
                ? "text-white bg-white/40"
                : "hover:bg-white/20 hover:text-white/50"
            }`}
          >
            {isSidebar ? longTitle : shortTitle}
          </button>
        </a>
      )}
    </>
  );
}
