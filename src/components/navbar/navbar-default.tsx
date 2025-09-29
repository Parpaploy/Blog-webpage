"use client";

import React from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import LoginButton from "./components/login-btn";
import { useSidebar } from "../../../hooks/sidebar";
import SignupButton from "./components/signup-btn";

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
        isSidebar ? "w-[calc(100%-15.5rem)]" : "w-[calc(100%-5.5rem)]"
      } h-[8svh] max-w-[1920px] pt-3 pr-5 transition-all`}
    >
      <nav className="w-full h-full rounded-lg px-3 bg-amber-200">
        <div className="w-full h-full flex justify-between items-center">
          {user !== null ? (
            <>
              <p className="font-semibold text-lg">
                {t("hello")} {user ? user.username : "Guest"}
              </p>

              <a href="/profile" className="rounded-full bg-amber-400">
                <div className="w-8.5 h-8.5 rounded-full border-1">
                  <img
                    className="w-full h-full rounded-full overflow-hidden object-cover aspect-square"
                    src={
                      user?.profile?.formats?.small?.url
                        ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user.profile.formats.small.url}`
                        : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                    }
                    alt={(user?.username || "Guest") + " profile picture"}
                  />
                </div>
              </a>
            </>
          ) : (
            <>
              {/* <p className="font-semibold text-lg"> Guest</p> */}

              <div className="flex justify-center items-center gap-5">
                <LoginButton isLoggedIn={isLoggedIn} title={t("login")} />
                <SignupButton isLoggedIn={isLoggedIn} title={t("signup")} />
              </div>
            </>
          )}
        </div>
      </nav>
    </main>
  );
}
