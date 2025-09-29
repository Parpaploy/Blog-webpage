"use client";

import React from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../navbar/components/language-switcher";
import { useSidebar } from "../../../hooks/sidebar";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import SidebarButton from "./components/sidebar-btn";
import LogoutButton from "./components/logout-btn";
import { IoPersonOutline } from "react-icons/io5";

export default function SidebarDefault({
  isLoggedIn,
  user,
  Logout,
}: {
  isLoggedIn: boolean;
  user: IUser | null;
  Logout: (formData: FormData) => void | Promise<void>;
}) {
  const { t } = useTranslation("navbar");

  const { isSidebar, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`fixed top-0 left-0 ${
        isSidebar ? "w-60" : "w-20"
      } h-full max-h-[1080px] p-3 transition-all`}
    >
      <main className="w-full h-full rounded-lg p-3 bg-amber-200">
        <div className="w-full h-full flex flex-col justify-between items-center">
          <a href="/">
            <div className="text-3xl font-bold transition-all">
              {isSidebar ? "Logo" : "L"}
            </div>
          </a>
          {/* <LanguageSwitcher /> */}

          {user !== null ? (
            <LogoutButton
              isLoggedIn={isLoggedIn}
              Logout={Logout}
              shortTitle={
                <p className="flex items-center justify-center">
                  <TbLogout />
                </p>
              }
              longTitle={
                <p className="flex items-center justify-start gap-3">
                  <TbLogout /> Logout
                </p>
              }
            />
          ) : (
            <SidebarButton
              path="/login"
              isLoggedIn={isLoggedIn}
              shortTitle={
                <p className="flex items-center justify-center">
                  <IoPersonOutline />
                </p>
              }
              longTitle={
                <p className="flex items-center justify-start gap-3">
                  <IoPersonOutline /> Login
                </p>
              }
            />
          )}
        </div>
      </main>

      <button
        className={`absolute top-6  p-1 text-center bg-red-200 rounded-full z-[10] cursor-pointer ${
          isSidebar ? "left-54" : "left-14"
        } transition-all`}
        onClick={toggleSidebar}
      >
        {isSidebar ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>
    </aside>
  );
}
