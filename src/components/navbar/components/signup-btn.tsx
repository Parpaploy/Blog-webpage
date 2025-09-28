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
        <>
          {/* {currentPath !== "/signup" && (
            <a href="/signup">
              <button
                type="submit"
                className="rounded-lgp-2 cursor-pointer transition-all underline"
              >
                {title}
              </button>
            </a>
          )} */}

          <a href="/signup">
            <button
              type="submit"
              className="rounded-lgp-2 cursor-pointer transition-all underline"
            >
              {title}
            </button>
          </a>
        </>
      )}
    </>
  );
}
