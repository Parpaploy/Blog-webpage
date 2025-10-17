import React from "react";
import ProfileMenu from "./profile-menu";
import { Logout } from "../../../../lib/auth";
import { useTranslation } from "react-i18next";

function ProfilePanel({
  toggle,
  setToggle,
}: {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
}) {
  const { t } = useTranslation("navbar");

  return (
    <>
      {toggle && (
        <div className="absolute top-12 right-5 w-60 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg overflow-hidden">
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
        </div>
      )}
    </>
  );
}

export default ProfilePanel;
