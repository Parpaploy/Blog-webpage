"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function SignupButton({
  isLoggedIn,
  title,
}: {
  isLoggedIn: boolean;
  title: ReactNode;
}) {
  const currentPath = usePathname();

  const router = useRouter();

  return (
    <>
      {!isLoggedIn && (
        <button
          onClick={() => {
            router.push("/signup");
          }}
          type="submit"
          className={`w-30 border border-white/30 border-l-0 backdrop-blur-sm shadow-md rounded-full px-2 py-1 transition-all ${
            currentPath === "/signup"
              ? "text-white bg-white/40 cursor-default"
              : "bg-white/10 hover:bg-white/20 text-white/50 hover:text-white/70 cursor-pointer"
          }`}
        >
          {title}
        </button>
      )}
    </>
  );
}
