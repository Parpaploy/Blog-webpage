"use client";

import React, { useState } from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import LogoutButton from "./components/logout-btn";
import SidebarMenu from "./components/sidebar-menu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { IoPersonOutline } from "react-icons/io5";
import { RiHomeLine } from "react-icons/ri";
import { TbBrandBlogger } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import LoginButton from "./components/login-btn";
import { useRouter } from "next/navigation";
import { GoSearch } from "react-icons/go";
import { IoAdd } from "react-icons/io5";

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
      className={`fixed top-0 left-0 z-50 ${
        isSidebar ? "w-60" : "w-20"
      } h-full p-3 transition-all`}
    >
      <main
        className={`relative w-full h-full ${
          isSidebar
            ? "rounded-l-[30px] rounded-r-lg p-1 pt-3 pb-2"
            : "rounded-full p-3"
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
                className={`w-full cursor-pointer transition-all overflow-hidden mb-3 ${
                  isSidebar ? "w-full text-start" : "text-center w-10"
                }`}
              >
                <img
                  src={
                    isSidebar
                      ? "/assets/placeholders/logoipsum-large.svg"
                      : "/assets/placeholders/logoipsum-small.svg"
                  }
                  className={`${
                    isSidebar ? "px-1.5" : "p-0"
                  } w-full h-full object-contain`}
                />
              </div>

              <SidebarMenu
                path="/"
                shortTitle={
                  <p className="flex items-center justify-center">
                    <RiHomeLine size={24} />
                  </p>
                }
                longTitle={
                  <div className="flex items-stretch justify-start gap-5">
                    <div className="w-[10%]">
                      <RiHomeLine size={24} />
                    </div>
                    <div className="w-[90%]">{t("home")}</div>
                  </div>
                }
              />

              <SidebarMenu
                path="/search"
                shortTitle={
                  <p className="flex items-center justify-center">
                    <GoSearch size={24} />
                  </p>
                }
                longTitle={
                  <div className="flex items-stretch justify-start gap-5">
                    <div className="w-[10%]">
                      <GoSearch size={24} />
                    </div>
                    <div className="w-[90%]">{t("search")}</div>
                  </div>
                }
              />

              {/* <SidebarMenu
                path="/blogs"
                shortTitle={
                  <p className="flex items-center justify-center">
                    <TbBrandBlogger size={24} />
                  </p>
                }
                longTitle={
                  <div className="flex items-stretch justify-start gap-10">
                    <div className="w-[10%]">
                      <TbBrandBlogger size={24} />
                    </div>
                    <div className="w-[90%]">{t("blogs")}</div>
                  </div>
                }
              /> */}

              {/* <SidebarMenu
                path="/subscribe-blogs"
                shortTitle={
                  <div className="flex items-center justify-center">
                    <FaRegStar size={24} />
                  </div>
                }
                longTitle={
                  <div className="flex items-stretch justify-start gap-10">
                    <div className="w-[10%]">
                      <FaRegStar size={24} />
                    </div>
                    <div className="w-[90%]">{t("subscribe-blogs")}</div>
                  </div>
                }
              /> */}
            </div>

            <div
              className={`flex flex-col justify-start gap-3 ${
                isSidebar ? "items-start w-full" : "items-center"
              }`}
            >
              <SidebarMenu
                path="/add-blog"
                shortTitle={
                  <p className="flex items-center justify-center">
                    <IoAdd size={24} />
                  </p>
                }
                longTitle={
                  <div className="flex items-stretch justify-start gap-5">
                    <div className="w-[10%]">
                      <IoAdd size={24} />
                    </div>
                    <div className="w-[90%] mt-0.5">{t("add")}</div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Bottom */}
          <div
            className={`flex flex-col justify-start gap-x-3 ${
              isSidebar ? "items-start w-full px-1" : "items-center"
            }`}
          >
            <div className="w-full border-t-1 border-white/30 mb-3" />

            <div className="w-full">
              {user !== null ? (
                <LogoutButton
                  isLoggedIn={isLoggedIn}
                  Logout={() => Logout(new FormData())}
                  longTitle={
                    <p className="flex items-center justify-start gap-3">
                      <TbLogout size={20} /> {t("logout")}
                    </p>
                  }
                />
              ) : (
                <LoginButton
                  path="/login"
                  isLoggedIn={isLoggedIn}
                  shortTitle={
                    <p className="flex items-center justify-center">
                      <IoPersonOutline size={20} />
                    </p>
                  }
                  longTitle={
                    <p className="flex items-center justify-start gap-3">
                      <IoPersonOutline size={20} /> {t("login")}
                    </p>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <button
        className={`absolute top-1/2 -translate-y-1/2 -right-[8px] h-10 px-0.5 text-center bg-white/40 hover:bg-white/50 backdrop-blur-sm border border-white/30 border-l-0 [box-shadow:5px_0px_12px_rgba(0,0,0,0.05)] text-white rounded-r-lg z-[10] cursor-pointer transition-all duration-150`}
        onClick={toggleSidebar}
      >
        {isSidebar ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>
    </aside>
  );
}
