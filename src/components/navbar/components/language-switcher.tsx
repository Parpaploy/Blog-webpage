"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [isThai, setIsThai] = useState(true);

  const toggleLang = () => {
    if (isThai) {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("th");
    }
    setIsThai(!isThai);
  };

  return (
    <button
      onClick={toggleLang}
      style={{ boxShadow: "1px 1px 5px white inset" }}
      className="w-[80px] h-[35px] rounded-full border-t border border-black md:border-[#838488] relative bg-transparent overflow-hidden flex items-center justify-center backdrop-blur-md cursor-pointer"
    >
      {/* Slide icon */}
      <div
        className="absolute transition-transform duration-300 ease-in-out left-2"
        style={{
          transform: isThai ? "translateX(0)" : "translateX(40px)",
        }}
      >
        <img
          src={
            isThai ? "/assets/icons/th-icon.svg" : "/assets/icons/en-icon.svg"
          }
          alt="lang-icon"
          className="w-[22px] h-[22px]"
          draggable="false"
        />
      </div>

      {/* Fade text */}
      <div
        style={{
          transform: isThai ? "translateX(10px)" : "translateX(-12px)",
        }}
        className="flex items-center justify-center w-full text-[16px]"
      >
        <span
          className={`absolute transition-opacity duration-300 ${
            isThai ? "opacity-100" : "opacity-0"
          }`}
        >
          TH
        </span>
        <span
          className={`absolute transition-opacity duration-300 ${
            isThai ? "opacity-0" : "opacity-100"
          }`}
        >
          ENG
        </span>
      </div>
    </button>
  );
}
