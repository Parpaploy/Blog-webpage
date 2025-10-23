"use client";

import React, { useState } from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import LogoutButton from "./components/logout-btn";
import SidebarMenu from "./components/sidebar-menu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { CiLogin, CiLogout } from "react-icons/ci";
import { RiHomeLine } from "react-icons/ri";
import { TbBrandBlogger } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import LoginButton from "./components/login-btn";
import { useRouter } from "next/navigation";
import { GoSearch } from "react-icons/go";
import { IoAdd } from "react-icons/io5";
import { Logo, LogoIcon } from "./components/logo";

export default function SidebarDefault({
  isLoggedIn,
  user,
  Logout,
}: {
  isLoggedIn: boolean;
  user: IUser | null;
  Logout: (formData: FormData) => void | Promise<void>;
}) {
  const { t } = useTranslation("sidebar");

  const { isSidebar, toggleSidebar } = useSidebar();

  const router = useRouter();

  return (
    <aside
      className={`hidden md:block fixed top-0 left-0 z-50 ${
        isSidebar ? "w-60" : "w-20"
      } h-full p-3 transition-all duration-300`}
    >
      <main
        className={`relative w-full h-full py-3 ${
          isSidebar ? "rounded-4xl px-1.75" : "rounded-4xl"
        } 
    bg-white/20 backdrop-blur-sm border border-white/30 shadow-md`}
      >
        <div className="relative z-10 w-full h-full flex flex-col justify-between items-center">
          {/* Top */}
          <div
            className={`flex flex-col h-full justify-between mb-3 ${
              isSidebar ? "items-start w-full" : "items-center"
            }`}
          >
            <div
              className={`flex flex-col h-full justify-start gap-3 ${
                isSidebar ? "items-start w-full" : "items-center"
              }`}
            >
              {/* Logo */}
              <div
                onClick={() => {
                  router.push("/");
                }}
                className={`w-full cursor-pointer transition-all overflow-hidden ${
                  isSidebar ? "w-full text-start" : "text-center w-10"
                }`}
              >
                {/* <img
                  src={
                    isSidebar
                      ? "/assets/placeholders/logoipsum-large.svg"
                      : "/assets/placeholders/logoipsum-small.svg"
                  }
                  className={`${
                    isSidebar ? "px-1.5" : "p-0"
                  } w-full h-full object-contain`}
                /> */}
                {isSidebar ? <Logo /> : <LogoIcon />}
              </div>

              <SidebarMenu
                path="/"
                icon={<RiHomeLine size={24} />}
                label={t("home")}
              />

              <SidebarMenu
                path="/search"
                icon={<GoSearch size={24} />}
                label={t("search")}
              />

              <SidebarMenu
                path="/blogs"
                icon={<TbBrandBlogger size={24} />}
                label={t("blogs")}
              />

              <SidebarMenu
                path="/subscribe-blogs"
                icon={<FaRegStar size={24} />}
                label={t("subscribe-blogs")}
                isLongLabel={true}
              />
            </div>

            <div
              className={`flex flex-col justify-start gap-3 ${
                isSidebar ? "items-start w-full" : "items-center"
              }`}
            >
              <SidebarMenu
                path="/add-blog"
                icon={<IoAdd size={24} />}
                label={t("add")}
              />
            </div>
          </div>

          {/* Bottom */}
          <div
            className={`flex flex-col justify-start gap-x-3 ${
              isSidebar ? "items-start w-full" : "items-center"
            }`}
          >
            <div className="w-full border-t-1 border-white/30 mb-3" />

            <div className="w-full">
              {user !== null ? (
                <LogoutButton
                  isLoggedIn={isLoggedIn}
                  Logout={() => Logout(new FormData())}
                  icon={<CiLogout size={24} />}
                  label={t("logout")}
                />
              ) : (
                <LoginButton
                  path="/login"
                  isLoggedIn={isLoggedIn}
                  icon={<CiLogin size={24} />}
                  label={t("login")}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <button
        className={`absolute top-1/2 -translate-y-1/2 -right-[4px] h-10 text-center bg-white/40 hover:bg-white/50 backdrop-blur-sm border border-white/30 border-l-0 border-t-0 border-b-0 [box-shadow:5px_0px_12px_rgba(0,0,0,0.05)] text-white rounded-r-lg z-[10] cursor-pointer transition-all duration-150`}
        onClick={toggleSidebar}
      >
        {isSidebar ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>
    </aside>
  );
}
