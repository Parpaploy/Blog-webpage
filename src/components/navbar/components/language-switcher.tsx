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
      className="w-20 h-8.5 rounded-full relative overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-xs border border-white/30 shadow-lg cursor-pointer"
    >
      {/* Slide icon */}
      <div
        className="absolute transition-transform duration-300 ease-in-out left-2"
        style={{
          transform: isThai ? "translateX(0)" : "translateX(40px)",
        }}
      >
        <div className="w-6 h-6 bg-white/20 border border-white/30 shadow-lg rounded-full overflow-hidden">
          <img
            src={
              isThai ? "/assets/icons/th-icon.svg" : "/assets/icons/en-icon.svg"
            }
            alt="lang-icon"
            className="w-full h-full object-cover opacity-80"
            draggable="false"
          />
        </div>
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
