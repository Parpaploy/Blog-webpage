"use client";

import { usePathname, useRouter } from "next/navigation";
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

  const router = useRouter();

  return (
    <>
      {!isLoggedIn && (
        <button
          onClick={() => {
            router.push(path);
          }}
          type="submit"
          className={`
            ${isSidebar ? "w-full" : "w-auto"} 
            ${
              isSidebar ? "rounded-2xl" : "rounded-full"
            }  p-2 bg-white/10 border border-white/30 border-l-0 shadow-md transition-all h-10 
            ${isSidebar ? "w-full px-3" : "w-10"} 
            ${
              currentPath === "/login"
                ? "text-white bg-white/40"
                : "hover:bg-white/20 text-white/50 hover:text-white/70 cursor-pointer"
            }`}
        >
          {isSidebar ? longTitle : shortTitle}
        </button>
      )}
    </>
  );
}
