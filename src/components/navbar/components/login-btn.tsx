"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { TbLogin } from "react-icons/tb";
import { useMediaQuery } from "../../../../hooks/media-query";

export default function LoginButton({
  isLoggedIn,
  title,
}: {
  isLoggedIn: boolean;
  title: ReactNode;
}) {
  const currentPath = usePathname();

  const router = useRouter();

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      {!isLoggedIn && (
        <>
          {isLargeScreen ? (
            <button
              onClick={() => {
                router.push("/login");
              }}
              type="submit"
              className={`w-25 border border-white/30 border-l-0 backdrop-blur-sm shadow-md rounded-full px-2 py-1.75 transition-all underline ${
                currentPath === "/login"
                  ? "text-white bg-white/40 cursor-default"
                  : "bg-white/10 hover:bg-white/20 text-white/50 hover:text-white/70 cursor-pointer"
              }`}
            >
              {title}
            </button>
          ) : (
            <button
              onClick={() => {
                router.push("/login");
              }}
              type="submit"
              className={`w-fit border border-white/30 backdrop-blur-sm shadow-md rounded-full p-2.25 transition-all underline ${
                currentPath === "/login"
                  ? "text-white bg-white/40 cursor-default"
                  : "bg-white/10 hover:bg-white/20 text-white/50 hover:text-white/70 cursor-pointer"
              }`}
            >
              <TbLogin size={20} />
            </button>
          )}
        </>
      )}
    </>
  );
}
