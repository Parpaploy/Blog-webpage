"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSidebar } from "../../../../hooks/sidebar";

export default function LogoutButton({
  isLoggedIn,
  Logout,
  shortTitle,
  longTitle,
}: {
  isLoggedIn: boolean;
  Logout: (formData: FormData) => void | Promise<void>;
  shortTitle: ReactNode;
  longTitle: ReactNode;
}) {
  const { isSidebar } = useSidebar();

  return (
    <>
      {isLoggedIn && (
        <form
          className={`${
            isSidebar ? "w-full" : "w-auto"
          } transition-all relative`}
          action={Logout}
        >
          <button
            type="submit"
            className={`  ${
              isSidebar ? "rounded-2xl" : "rounded-full"
            }  p-2 cursor-pointer hover:bg-white/20 text-white/50 hover:text-white/70 bg-white/10 border border-white/30 border-l-0 shadow-lg transition-all h-10 ${
              isSidebar ? "w-full px-3" : "w-10"
            }`}
          >
            {isSidebar ? longTitle : shortTitle}
          </button>
        </form>
      )}
    </>
  );
}
