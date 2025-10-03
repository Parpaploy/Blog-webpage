"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function SignupButton({
  isLoggedIn,
  title,
}: {
  isLoggedIn: boolean;
  title: ReactNode;
}) {
  const currentPath = usePathname();

  return (
    <>
      {!isLoggedIn && (
        <a href="/signup">
          <button
            type="submit"
            className={`border border-white/30 border-l-0 backdrop-blur-sm shadow-lg rounded-full px-2 py-1 cursor-pointer transition-all ${
              currentPath === "/signup"
                ? "text-white bg-white/40"
                : "bg-white/10 hover:bg-white/20 text-white/50 hover:text-white/70"
            }`}
          >
            {title}
          </button>
        </a>
      )}
    </>
  );
}
