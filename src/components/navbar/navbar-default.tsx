"use client";

import React, { useState } from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import LoginButton from "./components/login-btn";
import { useSidebar } from "../../../hooks/sidebar";
import SignupButton from "./components/signup-btn";
import LanguageSwitcher from "./components/language-switcher";
import { GoSearch } from "react-icons/go";

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

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    alert("Searching for: " + query);
    // other...
  };

  return (
    <main
      className={`fixed top-0 right-0 z-50 ${
        isSidebar ? "w-[calc(100%-15.5rem)]" : "w-[calc(100%-5.5rem)]"
      } h-fit max-w-[1920px] mt-3 pr-5 transition-all`}
    >
      <nav className="w-full h-full rounded-4xl">
        <div className="w-full h-full flex justify-between items-start text-white/70">
          {user !== null ? (
            <>
              <div className="font-semibold text-lg bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1 cursor-default">
                {t("hello")} {user.username}
              </div>

              <div className="w-[35%] flex gap-3 h-10">
                <div className="h-full flex-1">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-full bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-4 py-1"
                  />
                </div>
                <div
                  className="flex w-12 items-center justify-center h-full transition-all bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1 cursor-pointer"
                  onClick={handleSearch}
                >
                  <GoSearch size={20} />
                </div>
              </div>

              <div className="flex gap-3 items-center justify-center">
                <LanguageSwitcher />

                <a href="/profile" className="rounded-full">
                  <div className="w-8.5 h-8.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                    <img
                      className="w-full h-full rounded-full overflow-hidden object-cover aspect-square opacity-80"
                      src={
                        user?.profile?.formats?.small?.url
                          ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user.profile.formats.small.url}`
                          : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                      }
                      alt={(user?.username || "Guest") + " profile picture"}
                    />
                  </div>
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold text-lg bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-4xl px-2 py-1">
                {t("guest")}
              </p>

              <div className="flex justify-center items-center gap-2">
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
