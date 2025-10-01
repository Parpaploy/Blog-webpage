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
  const currentPath = usePathname();

  const { isSidebar } = useSidebar();

  return (
    <>
      {isLoggedIn && (
        <form
          className={`${isSidebar ? "w-full" : "w-auto"} transition-all`}
          action={Logout}
        >
          <button
            type="submit"
            className={`${
              isSidebar ? "rounded-lg" : "rounded-full"
            } bg-red-400 p-2 cursor-pointer transition-all h-10 ${
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
