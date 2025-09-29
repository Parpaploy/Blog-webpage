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
            className="rounded-lg bg-red-400 px-2 py-1 cursor-pointer transition-all"
          >
            {title}
          </button>
        </a>
      )}
    </>
  );
}
