"use client";
import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ProfileMenu from "./profile-menu";
import LanguageSwitcher from "./language-switcher";
import { IUser } from "../../../../interfaces/strapi.interface";
import ProfilePanel from "./profile-panel";
import ProfileButton from "./profile-button";
import AddButton from "@/components/add-btn";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiHomeLine } from "react-icons/ri";
import { TbBrandBlogger } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { usePathname } from "next/navigation";
import LoginButton from "./login-btn";
import SignupButton from "./signup-btn";

export default function MobileMenuPanel({
  isToggle,
  setIsToggle,
  openNavbar,
  setOpenNavbar,
  onCloseSearch,
  user,
  handleToggleProfile,
  defaultProfileUrl,
  handleImageError,
  isProfile,
  buttonRef,
}: {
  isToggle: boolean;
  setIsToggle: (isToggle: boolean) => void;
  openNavbar: boolean;
  setOpenNavbar: (open: boolean) => void;
  onCloseSearch?: () => void;
  user: IUser | null;
  handleToggleProfile: (e: React.MouseEvent) => void;
  defaultProfileUrl: string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  isProfile: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const { t } = useTranslation("sidebar");
  const mobileProfileButtonRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentPath = usePathname();

  const [isLangPanelOpen, setLangPanelOpen] = useState(false);

  const handleMenuClick = () => {
    setIsToggle(false);
    onCloseSearch?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef?.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsToggle(false);
      }
    };

    if (isToggle && !openNavbar && !isLangPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggle, setIsToggle, buttonRef, openNavbar, isLangPanelOpen]);

  const isLoggedIn: boolean = !!user;

  return (
    <AnimatePresence>
      {isToggle && (
        <motion.div
          ref={panelRef}
          initial={{
            opacity: 0,
            y: window.innerWidth >= 768 ? -10 : 10,
            x: 0,
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
          }}
          exit={{
            opacity: 0,
            y: window.innerWidth >= 768 ? -10 : 10,
            x: 0,
          }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-16 right-0 w-50 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg z-50 overflow-hidden"
        >
          <div className="w-full">
            <ProfileMenu
              path="/"
              title={t("home")}
              setToggle={setIsToggle}
              icon={<RiHomeLine />}
            />
            <ProfileMenu
              path="/search"
              title={t("search")}
              setToggle={setIsToggle}
              onClose={handleMenuClick}
              icon={<GoSearch />}
            />
            <ProfileMenu
              path="/blogs"
              title={t("blogs")}
              setToggle={setIsToggle}
              onClose={handleMenuClick}
              icon={<TbBrandBlogger />}
            />

            <ProfileMenu
              path="/subscribe-blogs"
              title={t("subscribe-blogs")}
              setToggle={setIsToggle}
              onClose={handleMenuClick}
              icon={<FaRegStar />}
              isLong={true}
            />

            <ProfileMenu
              path="/global-chat"
              title={t("global-chat")}
              setToggle={setIsToggle}
              onClose={handleMenuClick}
              icon={<IoChatbubblesOutline />}
            />
          </div>

          <div className="w-full flex justify-between items-center px-2">
            {user !== null ? (
              <AddButton isSmall={true} setMenuPanel={setIsToggle} />
            ) : (
              <>
                {currentPath === "/search" ? (
                  <div className="flex gap-1">
                    <LoginButton
                      isSmall={true}
                      isLoggedIn={isLoggedIn}
                      title={t("login")}
                      onClick={handleMenuClick}
                    />
                    <SignupButton
                      isSmall={true}
                      isLoggedIn={isLoggedIn}
                      title={t("signup")}
                      onClick={handleMenuClick}
                    />
                  </div>
                ) : (
                  <div />
                )}
              </>
            )}

            <div className="h-11 flex gap-2 justify-end items-center">
              {user !== null && (
                <>
                  <ProfileButton
                    ref={mobileProfileButtonRef}
                    user={user}
                    handleToggleProfile={handleToggleProfile}
                    defaultProfileUrl={defaultProfileUrl}
                    handleImageError={handleImageError}
                    isProfile={isProfile}
                  />
                  <ProfilePanel
                    toggle={openNavbar}
                    setToggle={setOpenNavbar}
                    buttonRef={mobileProfileButtonRef}
                    setMobileMenuToggle={setIsToggle}
                  />
                </>
              )}

              <LanguageSwitcher
                openNavbar={openNavbar}
                setOpenNavbar={setOpenNavbar}
                onCloseSearch={onCloseSearch}
                onPanelToggle={setLangPanelOpen}
                setMobileMenuToggle={setIsToggle}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
