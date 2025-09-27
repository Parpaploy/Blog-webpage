"use client";

import { usePathname } from "next/navigation";

export default function LoginButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const currentPath = usePathname();

  return (
    <>
      {!isLoggedIn && (
        <>
          {currentPath !== "/login" && (
            <a href="/login">
              <button type="submit" className="bg-green-400 p-2 cursor-pointer">
                Login
              </button>
            </a>
          )}
        </>
      )}
    </>
  );
}
