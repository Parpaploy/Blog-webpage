"use client";

import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ProfileMenu from "./profile-menu";
import LanguageSwitcher from "./language-switcher";
import { IUser } from "../../../../interfaces/strapi.interface";
import ProfilePanel from "./profile-panel";
import ProfileButton from "./profile-button";

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
}) {
  const { t } = useTranslation("sidebar");

  const mobileProfileButtonRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setIsToggle(false);
    onCloseSearch?.();
  };

  return (
    <AnimatePresence>
      {isToggle && (
        <motion.div
          initial={{
            opacity: 0,
            y: window.innerWidth >= 768 ? -10 : 0,
            x: window.innerWidth >= 768 ? 0 : 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
          }}
          exit={{
            opacity: 0,
            y: window.innerWidth >= 768 ? -10 : 0,
            x: window.innerWidth >= 768 ? 0 : -10,
          }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-16 right-0 w-50 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg z-50 overflow-hidden"
        >
          <div className="w-full">
            <ProfileMenu path="/" title={t("home")} setToggle={setIsToggle} />
            <ProfileMenu
              path="/search"
              title={t("search")}
              setToggle={setIsToggle}
              onClose={handleMenuClick}
            />
            <ProfileMenu
              path="/blogs"
              title={t("blogs")}
              setToggle={setIsToggle}
              onClose={handleMenuClick}
            />
            <ProfileMenu
              path="/subscribe-blogs"
              title={t("subscribe-blogs")}
              setToggle={setIsToggle}
              onClose={handleMenuClick}
            />
          </div>

          <div className="h-11 flex gap-2 justify-end items-center px-2">
            {user !== null && (
              <>
                <LanguageSwitcher
                  openNavbar={openNavbar}
                  setOpenNavbar={setOpenNavbar}
                  onCloseSearch={onCloseSearch}
                />

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
                />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
