"use client";

import React from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import LoginButton from "./components/login-btn";
import { useSidebar } from "../../../hooks/sidebar";

export default function NavbarDefault({
  isLoggedIn,
  user,
  Logout,
}: {
  isLoggedIn: boolean;
  user: IUser | null;
  Logout: (formData: FormData) => void | Promise<void>;
}) {
  const { t } = useTranslation("navbar");
  const { isSidebar } = useSidebar();

  return (
    <main
      className={`fixed top-0 right-0 ${
        isSidebar ? "w-[calc(100%-15rem)]" : "w-[calc(100%-5rem)]"
      } h-[8svh] max-w-[1920px] pt-3 pr-3 transition-all`}
    >
      <nav className="w-full h-full rounded-lg px-5 bg-amber-200">
        <div className="w-full h-full flex justify-between items-center">
          <div className="text-2xl font-bold">Logo</div>
          {user !== null ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-7 h-7">
                <img
                  className="w-full h-full rounded-full overflow-hidden object-cover aspect-square"
                  src={
                    `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user?.profile?.formats?.small?.url}` ||
                    ""
                  }
                  alt={user?.username + "profile picture"}
                />
              </div>
              <p className="font-semibold text-lg">
                {t("hello")} {user ? user.username : "Guest"}
              </p>
            </div>
          ) : (
            <LoginButton isLoggedIn={isLoggedIn} title={t("login")} />
          )}
        </div>
      </nav>
    </main>
  );
}
