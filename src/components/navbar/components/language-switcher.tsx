"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const [isThai, setIsThai] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleLang = () => {
    setLoading(true);

    setTimeout(() => {
      i18n.changeLanguage(isThai ? "en" : "th");
      setIsThai(!isThai);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
          <div className="loader">
            <div style={{ "--i": 1 } as React.CSSProperties}></div>
            <div style={{ "--i": 2 } as React.CSSProperties}></div>
            <div style={{ "--i": 3 } as React.CSSProperties}></div>
            <div style={{ "--i": 4 } as React.CSSProperties}></div>
          </div>
        </div>
      )}

      <button
        onClick={toggleLang}
        className="w-20 h-10 rounded-full relative overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-xs border border-white/30 shadow-lg cursor-pointer"
        disabled={loading}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="absolute transition-transform duration-300 ease-in-out left-2"
            style={{
              transform: isThai ? "translateX(0)" : "translateX(40px)",
            }}
          >
            <div className="w-6 h-6 bg-white/20 border border-white/30 shadow-lg rounded-full overflow-hidden">
              <img
                src={
                  isThai
                    ? "/assets/icons/th-icon.svg"
                    : "/assets/icons/en-icon.svg"
                }
                alt="lang-icon"
                className="w-full h-full object-cover opacity-80"
                draggable="false"
              />
            </div>
          </div>

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
        </div>
      </button>
    </>
  );
}
