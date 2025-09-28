"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function LoginButton({
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
        <>
          {currentPath !== "/login" && (
            <a href="/login">
              <button
                type="submit"
                className="rounded-lg bg-red-400 p-2 cursor-pointer transition-all "
              >
                {title}
              </button>
            </a>
          )}
        </>
      )}
    </>
  );
}
