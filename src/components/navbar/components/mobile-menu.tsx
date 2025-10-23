"use client";

import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileMenuPanel from "./mobile-menu-panel";
import { IUser } from "../../../../interfaces/strapi.interface";

export default function MobileMenu({
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
  return (
    <>
      <button
        onClick={() => {
          setIsToggle(!isToggle);
        }}
        type="submit"
        className={`relative w-fit border md:border-white/30 border-transparent md:backdrop-blur-sm md:shadow-md rounded-full p-2.25 transition-all underline ${
          isToggle
            ? "text-white bg-white/40 cursor-default"
            : "md:bg-white/10 hover:bg-white/20 text-white/50 hover:text-white/70 cursor-pointer"
        }`}
      >
        <RxHamburgerMenu size={20} />
      </button>

      <MobileMenuPanel
        isToggle={isToggle}
        setIsToggle={setIsToggle}
        openNavbar={openNavbar}
        setOpenNavbar={setOpenNavbar}
        onCloseSearch={onCloseSearch}
        user={user}
        handleToggleProfile={handleToggleProfile}
        defaultProfileUrl={defaultProfileUrl}
        handleImageError={handleImageError}
        isProfile={isProfile}
      />
    </>
  );
}
