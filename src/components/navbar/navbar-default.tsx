"use client";

import React, { useEffect, useState } from "react";
import {
  IBlog,
  ICategory,
  ISubscribeBlog,
  IUser,
} from "../../../interfaces/strapi.interface";
import { useTranslation } from "react-i18next";
import LoginButton from "./components/login-btn";
import { useSidebar } from "../../../hooks/sidebar";
import SignupButton from "./components/signup-btn";
import LanguageSwitcher from "./components/language-switcher";
import { usePathname, useRouter } from "next/navigation";
import ProfilePanel from "./components/profile-panel";
import Search from "./components/search";

export default function NavbarDefault({
  isLoggedIn,
  user,
  Logout,
  categories,
  blogs,
  subscribeBlogs,
}: {
  isLoggedIn: boolean;
  user: IUser | null;
  Logout: (formData: FormData) => void | Promise<void>;
  categories: ICategory[];
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
}) {
  const { t } = useTranslation("navbar");

  const { isSidebar } = useSidebar();

  const router = useRouter();

  const pathname = usePathname();

  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [isOpenCat, setIsOpenCat] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);

  useEffect(() => {
    setIsToggle(false);
  }, [pathname]);

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
              <div className="font-semibold text-lg bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-default">
                {t("hello")} {user.username}
              </div>

              {pathname === "/search" && (
                <Search
                  categories={categories}
                  isOpenCat={isOpenCat}
                  setIsOpenCat={setIsOpenCat}
                  isHover={isHover}
                  setIsHover={setIsHover}
                  blogs={blogs}
                  subscribeBlogs={subscribeBlogs}
                />
              )}

              <div className="flex gap-3 items-center justify-center">
                <LanguageSwitcher />

                <div
                  onClick={() => {
                    setIsToggle(!isToggle);
                  }}
                  className="cursor-pointer w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-md"
                >
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
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold text-lg bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1">
                {t("guest")}
              </p>

              <div className="flex justify-center items-center gap-2">
                <LanguageSwitcher />
                <LoginButton isLoggedIn={isLoggedIn} title={t("login")} />
                <SignupButton isLoggedIn={isLoggedIn} title={t("signup")} />
              </div>
            </>
          )}
        </div>
      </nav>

      <ProfilePanel toggle={isToggle} setToggle={setIsToggle} />
    </main>
  );
}
