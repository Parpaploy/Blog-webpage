"use client";

import React from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/language-switcher";
import LoginButton from "./components/login-btn";
import LogoutButton from "./components/logout-btn";

export default function NavbarDefault({
  isLoggedIn,
  user,
  Logout,
}: {
  isLoggedIn: boolean;
  user: IUser | null;
  Logout: (formData: FormData) => void | Promise<void>;
}) {
  //   console.log(user, ":user");
  const { t } = useTranslation("navbar");

  return (
    <main className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[7svh] max-w-[1920px] mx-auto bg-amber-200">
      <div className="w-full h-full flex justify-between items-center">
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

        {user !== null ? (
          <LogoutButton
            isLoggedIn={isLoggedIn}
            Logout={Logout}
            title={t("logout")}
          />
        ) : (
          <LoginButton isLoggedIn={isLoggedIn} title={t("login")} />
        )}

        <LanguageSwitcher />
      </div>
    </main>
  );
}
