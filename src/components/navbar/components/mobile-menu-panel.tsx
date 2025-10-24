"use client";
import React, { useRef, useEffect, useState } from "react";
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
            {user !== null ? (
              <ProfileMenu
                path="/subscribe-blogs"
                title={t("subscribe-blogs")}
                setToggle={setIsToggle}
                onClose={handleMenuClick}
              />
            ) : (
              <ProfileMenu
                path="/subscribe-blogs"
                title={t("subscribe-blogs")}
                setToggle={setIsToggle}
                onClose={handleMenuClick}
                haveLine={false}
              />
            )}
          </div>
          {user !== null && (
            <div className="h-11 flex gap-2 justify-end items-center px-2">
              <>
                <LanguageSwitcher
                  openNavbar={openNavbar}
                  setOpenNavbar={setOpenNavbar}
                  onCloseSearch={onCloseSearch}
                  onPanelToggle={setLangPanelOpen}
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
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
