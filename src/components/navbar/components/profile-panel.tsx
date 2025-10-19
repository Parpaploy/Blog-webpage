import React, { useEffect, useRef } from "react";
import ProfileMenu from "./profile-menu";
import { Logout } from "../../../../lib/auth";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePanel = ({
  toggle,
  setToggle,
}: {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
}) => {
  const { t } = useTranslation("navbar");

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toggle) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggle, setToggle]);

  return (
    <AnimatePresence>
      {toggle && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-12 right-0 w-60 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg overflow-hidden"
        >
          <ProfileMenu
            path="/profile"
            title={t("manage")}
            setToggle={setToggle}
          />
          <ProfileMenu
            path="/your-blogs"
            title={t("your-blogs")}
            setToggle={setToggle}
          />
          <div
            onClick={() => {
              Logout();
              setToggle(false);
            }}
            className="text-white/80 text-md cursor-pointer hover:bg-white/30 transition-all hover:text-white/90 px-3 py-2"
          >
            {t("logout")}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ProfilePanel.displayName = "ProfilePanel";
export default ProfilePanel;
