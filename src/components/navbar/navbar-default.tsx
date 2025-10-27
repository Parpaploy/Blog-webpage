"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { usePathname } from "next/navigation";
import ProfilePanel from "./components/profile-panel";
import Search from "./components/search";
import { useToggle } from "../../../hooks/toggle";
import MobileMenu from "./components/mobile-menu";
import MobileMenuPanel from "./components/mobile-menu-panel";
import ProfileButton from "./components/profile-button";

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
  const pathname = usePathname();

  const { openNavbar, setOpenNavbar, registerRef } = useToggle();

  const navRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const [isOpenCat, setIsOpenCat] = useState<boolean>(false);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setIsOpenCat(false);
    setIsOpenFilter(false);
  };

  const defaultProfileUrl =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg";

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = defaultProfileUrl;
    e.currentTarget.onerror = null;
  };

  useEffect(() => {
    return registerRef(navRef.current, "navbar");
  }, [registerRef, user]);

  useEffect(() => {
    setOpenNavbar(false);
  }, [pathname, setOpenNavbar]);

  const handleToggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsOpenCat(false);
    setIsOpenFilter(false);

    setOpenNavbar((prev) => !prev);
  };

  return (
    <main
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-50 
            md:top-0 md:right-0 md:left-auto md:translate-x-0 ${
              isSidebar
                ? "md:w-[calc(100%-15.5rem)] w-[95%]"
                : "md:w-[calc(100%-5.5rem)] w-[95%]"
            } md:h-fit max-w-[1920px] mt-3 md:pr-5 !transition-all duration-300`}
    >
      <nav
        className="w-full h-full rounded-4xl 
                      p-2 md:p-0 
                      bg-white/10 backdrop-blur-sm border border-white/30 shadow-md
                      md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none
      "
      >
        <div className="w-full h-full flex justify-between items-start gap-0.5 text-white/70">
          {user !== null ? (
            <div
              className={`${
                pathname === "/search"
                  ? "hidden lg:block"
                  : "block md:hidden lg:block"
              } whitespace-nowrap font-semibold text-lg bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1 cursor-default`}
            >
              {t("hello")} {user.username}
            </div>
          ) : (
            <p
              className={`${
                pathname === "/search"
                  ? "hidden lg:block"
                  : "block md:hidden lg:block"
              } whitespace-nowrap font-semibold text-lg bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-4xl px-2 py-1`}
            >
              {t("guest")}
            </p>
          )}

          {pathname === "/search" && (
            <div
              className={`w-full flex items-center lg:justify-center justify-start`}
            >
              <Search
                categories={categories}
                isOpenCat={isOpenCat}
                setIsOpenCat={setIsOpenCat}
                isHover={isHover}
                setIsHover={setIsHover}
                blogs={blogs}
                subscribeBlogs={subscribeBlogs}
                isOpenFilter={isOpenFilter}
                setIsOpenFilter={setIsOpenFilter}
                user={user}
                isOpen={isSearchOpen}
                onClose={handleCloseSearch}
              />
            </div>
          )}

          {user !== null ? (
            <>
              <div />

              <div className="relative md:flex gap-3 items-center justify-center hidden">
                <LanguageSwitcher
                  openNavbar={openNavbar}
                  setOpenNavbar={setOpenNavbar}
                  onCloseSearch={handleCloseSearch}
                />

                <ProfileButton
                  ref={profileButtonRef}
                  user={user}
                  handleToggleProfile={handleToggleProfile}
                  defaultProfileUrl={defaultProfileUrl}
                  handleImageError={handleImageError}
                  isProfile={openNavbar}
                />

                <ProfilePanel
                  toggle={openNavbar}
                  setToggle={setOpenNavbar}
                  buttonRef={profileButtonRef}
                  setMobileMenuToggle={setIsMobileMenuOpen}
                />
              </div>
            </>
          ) : (
            <>
              <div
                className={`md:flex justify-center items-center gap-2 hidden ${
                  isSidebar && "lg:gap-2 md:gap-0.5"
                }`}
              >
                <LoginButton isLoggedIn={isLoggedIn} title={t("login")} />
                <SignupButton isLoggedIn={isLoggedIn} title={t("signup")} />
                <div className="md:block hidden">
                  <LanguageSwitcher
                    openNavbar={openNavbar}
                    setOpenNavbar={setOpenNavbar}
                    onCloseSearch={handleCloseSearch}
                  />
                </div>
              </div>
            </>
          )}

          <div className="md:hidden flex gap-1">
            <LoginButton isLoggedIn={isLoggedIn} title={t("login")} />
            <SignupButton isLoggedIn={isLoggedIn} title={t("signup")} />

            <MobileMenu
              ref={mobileMenuButtonRef}
              isToggle={isMobileMenuOpen}
              setIsToggle={setIsMobileMenuOpen}
            />
          </div>
        </div>
      </nav>

      <div className="md:hidden block">
        <MobileMenuPanel
          isToggle={isMobileMenuOpen}
          setIsToggle={setIsMobileMenuOpen}
          openNavbar={openNavbar}
          setOpenNavbar={setOpenNavbar}
          onCloseSearch={handleCloseSearch}
          user={user}
          handleToggleProfile={handleToggleProfile}
          defaultProfileUrl={defaultProfileUrl}
          handleImageError={handleImageError}
          isProfile={openNavbar}
          buttonRef={mobileMenuButtonRef}
        />
      </div>
    </main>
  );
}
