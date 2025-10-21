"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher({
  openNavbar,
  setOpenNavbar = () => {},
  onCloseSearch,
}: {
  openNavbar: boolean;
  setOpenNavbar: (open: boolean) => void;
  onCloseSearch?: () => void;
}) {
  const { i18n, t } = useTranslation("navbar");
  const [hasMounted, setHasMounted] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const [isThai, setIsThai] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language");
      return savedLang ? savedLang === "th" : true;
    }
    return true;
  });
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setPanelOpen] = useState(false);

  const [isHoverDisabled, setIsHoverDisabled] = useState(false);

  const handleMouseLeave = () => {
    setIsHoverDisabled(false);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (openNavbar) {
      setPanelOpen(false);
    }
  }, [openNavbar]);

  useEffect(() => {
    if (hasMounted) {
      const savedLang = localStorage.getItem("language") || "th";
      if (i18n.language !== savedLang) {
        i18n.changeLanguage(savedLang);
      }
      setIsThai(savedLang === "th");
    }
  }, [hasMounted, i18n]);

  useEffect(() => {
    if (!isPanelOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPanelOpen]);

  const handleLanguageChange = (newLang: "th" | "en") => {
    if (loading || i18n.language === newLang) {
      setPanelOpen(false);

      return;
    }

    setLoading(true);
    setPanelOpen(false);

    setTimeout(() => {
      i18n.changeLanguage(newLang);
      setIsThai(newLang === "th");
      localStorage.setItem("language", newLang);
      setLoading(false);
    }, 500);
  };

  const largeScreenToggle = () => {
    if (loading) return;
    handleLanguageChange(isThai ? "en" : "th");
    setIsHoverDisabled(true);
  };

  if (!hasMounted) {
    return (
      <div className="w-10 h-10 rounded-full lg:w-20 bg-white/5 animate-pulse" />
    );
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-[9999]">
          <div className="loader">
            <div style={{ "--i": 1 } as React.CSSProperties}></div>
            <div style={{ "--i": 2 } as React.CSSProperties}></div>
            <div style={{ "--i": 3 } as React.CSSProperties}></div>
            <div style={{ "--i": 4 } as React.CSSProperties}></div>
          </div>
        </div>
      )}

      <div ref={switcherRef} className="relative flex items-center">
        {/* Large */}
        <button
          onClick={largeScreenToggle}
          onMouseLeave={handleMouseLeave}
          className={`group w-20 h-10 rounded-full relative overflow-hidden hidden lg:flex items-center justify-center bg-white/10 backdrop-blur-xs border border-white/30 shadow-md cursor-pointer`} // <--- ลบ isHoverDisabled ออกจากตรงนี้
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                transform: isThai ? "translateX(-2px)" : "translateX(40px)",
              }}
            >
              <div
                className={`transition-all ${
                  !isHoverDisabled
                    ? isThai
                      ? "group-hover:translate-x-1 group-hover:opacity-70"
                      : "group-hover:-translate-x-1 group-hover:opacity-70"
                    : ""
                } w-6 h-6 bg-white/20 border border-white/30 shadow-md rounded-full overflow-hidden`}
              >
                <img
                  src={
                    isThai
                      ? "/assets/icons/th-icon.svg"
                      : "/assets/icons/en-icon.svg"
                  }
                  alt="lang-icon"
                  className="w-full h-full object-cover opacity-70"
                  draggable="false"
                />
              </div>
            </div>
            <div
              style={{
                transform: isThai ? "translateX(12px)" : "translateX(-12px)",
              }}
              className="flex items-center justify-center w-full text-[16px]"
            >
              <span
                className={`absolute transition-opacity duration-300 ${
                  isThai
                    ? `opacity-100 ${
                        !isHoverDisabled ? "group-hover:opacity-70" : ""
                      }`
                    : "opacity-0"
                }`}
              >
                {t("thai")}
              </span>
              <span
                className={`absolute transition-opacity duration-300 ${
                  isThai
                    ? "opacity-0"
                    : `opacity-100 ${
                        !isHoverDisabled ? "group-hover:opacity-70" : ""
                      }`
                }`}
              >
                {t("english")}
              </span>
            </div>
          </div>
        </button>

        {/* Small */}
        <button
          onClick={() => {
            setOpenNavbar(false);
            setPanelOpen((prev) => !prev);

            if (typeof onCloseSearch === "function") {
              onCloseSearch();
            }
          }}
          className="w-10 h-10 rounded-full flex lg:hidden items-center justify-center bg-white/10 backdrop-blur-xs border border-white/30 shadow-md cursor-pointer"
          disabled={loading}
        >
          <div className="w-6 h-6">
            <img
              src={
                isThai
                  ? "/assets/icons/th-icon.svg"
                  : "/assets/icons/en-icon.svg"
              }
              alt="lang-icon"
              className="w-full h-full object-cover opacity-70"
              draggable="false"
            />
          </div>
        </button>

        <AnimatePresence>
          {isPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 right-0 w-40 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg overflow-hidden z-50"
            >
              <div
                onClick={() => handleLanguageChange("th")}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all ${
                  isThai
                    ? "bg-white/30 text-white/90"
                    : "text-white/80 hover:bg-white/30 hover:text-white/90 cursor-pointer"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img
                  src="/assets/icons/th-icon.svg"
                  alt="thai-icon"
                  className="w-6 h-6 opacity-70"
                />
                <span className="text-md">{t("thai")}</span>
              </div>

              <div
                onClick={() => handleLanguageChange("en")}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all ${
                  !isThai
                    ? "bg-white/30 text-white/90"
                    : "text-white/80 hover:bg-white/30 hover:text-white/90 cursor-pointer"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img
                  src="/assets/icons/en-icon.svg"
                  alt="eng-icon"
                  className="w-6 h-6 opacity-70"
                />
                <span className="text-md">{t("english")}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
