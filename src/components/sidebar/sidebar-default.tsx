"use client";

import React from "react";
import { IUser } from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../hooks/sidebar";
import SidebarButton from "./components/sidebar-btn";
import LogoutButton from "./components/logout-btn";
import SidebarMenu from "./components/sidebar-menu";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { IoPersonOutline } from "react-icons/io5";
import { RiHomeLine } from "react-icons/ri";
import { TbBrandBlogger } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";

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

  return (
    <aside
      className={`fixed top-0 left-0 ${
        isSidebar ? "w-60" : "w-20"
      } h-full p-3 transition-all`}
    >
      <main
        className={`w-full h-full ${
          isSidebar ? "rounded-lg" : "rounded-full"
        } p-3 bg-amber-200`}
      >
        <div className="w-full h-full flex flex-col justify-between items-center">
          {/* Top */}
          <div
            className={`flex flex-col h-full justify-start gap-3 ${
              isSidebar ? "items-start w-full" : "items-center"
            }`}
          >
            <a href="/" className="w-full">
              <div
                className={`rounded-lg cursor-pointer transition-all overflow-hidden ${
                  isSidebar ? "w-full text-start" : "text-center w-10"
                }`}
              >
                <img
                  src={
                    isSidebar
                      ? "/assets/placeholders/logoipsum-large.svg"
                      : "/assets/placeholders/logoipsum-small.svg"
                  }
                  className="w-full h-full object-contain"
                />
              </div>
            </a>

            <SidebarMenu
              path="/"
              shortTitle={
                <p className="flex items-center justify-center">
                  <RiHomeLine size={20} />
                </p>
              }
              longTitle={
                <div className="flex items-stretch justify-start gap-3 ">
                  <div className="w-[10%]">
                    <RiHomeLine size={20} />
                  </div>
                  <div className="w-[90%]">{t("home")}</div>
                </div>
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
                <div className="flex items-stretch justify-start gap-3">
                  <div className="w-[10%]">
                    <TbBrandBlogger size={20} />
                  </div>
                  <div className="w-[90%]">{t("blogs")}</div>
                </div>
              }
            />

            {user !== null && (
              <SidebarMenu
                path="/subscribe-blogs"
                shortTitle={
                  <div className="flex items-center justify-center">
                    <FaRegStar size={20} />
                  </div>
                }
                longTitle={
                  <div className="flex items-stretch justify-start gap-3">
                    <div className="w-[10%]">
                      <FaRegStar size={20} />
                    </div>
                    <div className="w-[90%]">{t("subscribe-blogs")}</div>
                  </div>
                }
              />
            )}
          </div>

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
                      <TbLogout size={20} /> {t("logout")}
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
