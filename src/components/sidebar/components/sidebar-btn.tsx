"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useSidebar } from "../../../../hooks/sidebar";

export default function SidebarButton({
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
          className={`rounded-lg p-2 cursor-pointer ${
            isSidebar ? "w-full" : "w-auto"
          } transition-all h-10 ${isSidebar ? "w-full px-3" : "w-10"}`}
        >
          {isSidebar ? longTitle : shortTitle}
        </button>
      )}
    </>
  );
}
