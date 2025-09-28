"use client";

import { usePathname } from "next/navigation";
import SignButton from "./sign-btn";
import { ReactNode } from "react";

export default function LogoutButton({
  isLoggedIn,
  Logout,
  title,
}: {
  isLoggedIn: boolean;
  Logout: (formData: FormData) => void | Promise<void>;
  title: ReactNode;
}) {
  const currentPath = usePathname();

  return (
    <>
      {isLoggedIn && (
        <>
          <form action={Logout}>
            <SignButton title={title} />
          </form>
        </>
      )}
    </>
  );
}
