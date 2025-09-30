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
import SidebarMenu from "./components/sidebar-menu";
import { GrHomeRounded } from "react-icons/gr";
import { TbBrandBlogger } from "react-icons/tb";

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
          {/* Top */}
          <div
            className={`flex flex-col h-full justify-start gap-3 ${
              isSidebar ? "items-start w-full" : "items-center"
            }`}
          >
            <a href="/">
              <div className="flex text-3xl font-bold transition-all">
                {isSidebar ? "Logo" : "L"}
              </div>
            </a>

            <SidebarMenu
              path="/"
              shortTitle={
                <p className="flex items-center justify-center">
                  <GrHomeRounded size={18} />
                </p>
              }
              longTitle={
                <p className="flex items-center justify-start gap-3 ">
                  <GrHomeRounded size={18} /> Home
                </p>
              }
            />

            <SidebarMenu
              path="/blogs"
              shortTitle={
                <p className="flex items-center justify-center">
                  <TbBrandBlogger size={20} />
                </p>
              }
              longTitle={
                <p className="flex items-center justify-start gap-3">
                  <TbBrandBlogger size={20} /> Blogs
                </p>
              }
            />
          </div>
          {/* <LanguageSwitcher /> */}

          {/* Bottom */}
          <div
            className={`flex flex-col justify-start gap-3 ${
              isSidebar ? "items-start w-full" : "items-center"
            }`}
          >
            <div className="w-full border-t-1 border-black/30" />
            <div className="w-full">
              {user !== null ? (
                <LogoutButton
                  isLoggedIn={isLoggedIn}
                  Logout={Logout}
                  shortTitle={
                    <p className="flex items-center justify-center">
                      <TbLogout size={20} />
                    </p>
                  }
                  longTitle={
                    <p className="flex items-center justify-start gap-3">
                      <TbLogout size={20} /> Logout
                    </p>
                  }
                />
              ) : (
                <SidebarButton
                  path="/login"
                  isLoggedIn={isLoggedIn}
                  shortTitle={
                    <p className="flex items-center justify-center">
                      <IoPersonOutline size={20} />
                    </p>
                  }
                  longTitle={
                    <p className="flex items-center justify-start gap-3">
                      <IoPersonOutline size={20} /> Login
                    </p>
                  }
                />
              )}
            </div>
          </div>
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
