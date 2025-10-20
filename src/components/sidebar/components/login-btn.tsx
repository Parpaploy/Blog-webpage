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
            whitespace-nowrap 
            ${isSidebar ? "w-full" : "w-auto"}
            group 
            backdrop-blur-sm 
            border border-white/30 border-l-0 border-r-0 
            shadow-md 
            px-2 py-1.75
            transition-all
            relative 
            
            ${
              isSidebar
                ? "rounded-3xl w-full px-2 text-start"
                : "rounded-full text-center w-11"
            }  
            
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
