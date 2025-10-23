"use client";

import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

export default function MobileMenu({
  isToggle,
  setIsToggle,
}: {
  isToggle: boolean;
  setIsToggle: (isToggle: boolean) => void;
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
        <RxHamburgerMenu className="w-5 h-5" />
      </button>
    </>
  );
}
