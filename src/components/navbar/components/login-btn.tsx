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
        <a href="/login">
          <button
            type="submit"
            className="rounded-lg cursor-pointer transition-all underline"
          >
            {title}
          </button>
        </a>
      )}
    </>
  );
}
