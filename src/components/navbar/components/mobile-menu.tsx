"use client";
import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

const MobileMenu = React.forwardRef<
  HTMLButtonElement,
  {
    isToggle: boolean;
    setIsToggle: (isToggle: boolean) => void;
  }
>(({ isToggle, setIsToggle }, ref) => {
  return (
    <>
      <button
        ref={ref}
        onClick={() => {
          setIsToggle(!isToggle);
        }}
        type="button"
        className={`relative w-fit rounded-full p-2.25 border border-white/30 transition-all shadow-md underline cursor-pointer ${
          isToggle
            ? "text-white bg-white/40"
            : "bg-white/10 hover:bg-white/20 text-white/50 hover:text-white/70"
        }`}
      >
        <RxHamburgerMenu className="w-5 h-5" />
      </button>
    </>
  );
});

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
