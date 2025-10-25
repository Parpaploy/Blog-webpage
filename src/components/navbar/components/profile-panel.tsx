"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import ProfileMenu from "./profile-menu";
import { Logout } from "../../../../lib/auth";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { PanelPosition } from "../../../../types/ui.type";

const ProfilePanel = ({
  toggle,
  setToggle,
  buttonRef,
  setMobileMenuToggle,
}: {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
  buttonRef: React.RefObject<HTMLDivElement | null>;
  setMobileMenuToggle: (toggle: boolean) => void;
}) => {
  const { t } = useTranslation("navbar");
  const panelRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);

  const handleMenuClick = () => {
    setToggle(false);
    setMobileMenuToggle?.(false);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (toggle && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isDesktop = window.innerWidth >= 768;

      if (isDesktop) {
        setPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      } else {
        setPosition({
          bottom: window.innerHeight - rect.bottom - 6,
          right: window.innerWidth - rect.left + 160,
        });
      }
    }
  }, [toggle, buttonRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    };

    if (toggle) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggle, setToggle, buttonRef]);

  if (!hasMounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {toggle && position && (
        <motion.div
          ref={panelRef}
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
          onClick={(e) => e.stopPropagation()}
          className="fixed md:w-60 w-40 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg overflow-hidden z-[999]"
          style={{
            top: position.top ? `${position.top}px` : "auto",
            right: position.right ? `${position.right}px` : "auto",
            bottom: position.bottom ? `${position.bottom}px` : "auto",
          }}
        >
          <ProfileMenu
            path="/profile"
            title={t("manage")}
            setToggle={setToggle}
            setMenuToggle={handleMenuClick}
          />
          <ProfileMenu
            path="/your-blogs"
            title={t("your-blogs")}
            setToggle={setToggle}
            setMenuToggle={handleMenuClick}
          />
          <div
            onClick={() => {
              Logout();
              handleMenuClick();
            }}
            className="text-white/80 text-md cursor-pointer hover:bg-white/30 transition-all hover:text-white/90 px-3 py-2"
          >
            {t("logout")}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

ProfilePanel.displayName = "ProfilePanel";
export default ProfilePanel;
