"use client";

import { usePathname } from "next/navigation";
import SignButton from "./sign-btn";
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
              <SignButton title={title} />
            </a>
          )}
        </>
      )}
    </>
  );
}
