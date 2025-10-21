"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useSidebar } from "../../../../hooks/sidebar";

export default function LoginButton({
  isLoggedIn,
  path,
  label,
  icon,
}: {
  isLoggedIn: boolean;
  path: string;
  label: string;
  icon: ReactNode;
}) {
  const currentPath = usePathname();

  const { isSidebar } = useSidebar();

  const router = useRouter();

  const [showLabel, setShowLabel] = useState(isSidebar);

  useEffect(() => {
    if (isSidebar) {
      const timer = setTimeout(() => setShowLabel(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowLabel(false);
    }
  }, [isSidebar]);

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
            duration-300
            ease-in-out
            relative 
            ${
              isSidebar
                ? "rounded-3xl w-full px-3 text-start"
                : "rounded-full text-center w-11"
            }  
            ${
              currentPath === "/login"
                ? "text-white bg-white/40"
                : "hover:bg-white/20 text-white/50 hover:text-white/70 cursor-pointer"
            }
                `}
        >
          {isSidebar ? (
            <div className="flex items-stretch justify-start gap-5">
              <div className="w-[10%]">{icon}</div>
              <div
                className={`w-[90%] transition-opacity duration-700 ${
                  showLabel ? "opacity-100" : "opacity-0"
                }`}
              >
                {label}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">{icon}</div>
          )}
        </button>
      )}
    </>
  );
}
