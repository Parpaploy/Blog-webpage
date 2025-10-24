"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type PanelPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export default function LanguageSwitcher({
  openNavbar,
  setOpenNavbar = () => {},
  onCloseSearch,
  onPanelToggle,
}: {
  openNavbar: boolean;
  setOpenNavbar: (open: boolean) => void;
  onCloseSearch?: () => void;
  onPanelToggle?: (isOpen: boolean) => void;
}) {
  const { i18n, t } = useTranslation("navbar");
  const [hasMounted, setHasMounted] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [isThai, setIsThai] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language");
      return savedLang ? savedLang === "th" : true;
    }
    return true;
  });
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setPanelOpen] = useState(false);

  const [position, setPosition] = useState<PanelPosition | null>(null);

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
    onPanelToggle?.(isPanelOpen);
  }, [isPanelOpen, onPanelToggle]);

  useEffect(() => {
    if (hasMounted) {
      const savedLang = localStorage.getItem("language") || "th";
      if (i18n.language !== savedLang) {
        i18n.changeLanguage(savedLang);
      }
      setIsThai(savedLang === "th");
    }
  }, [hasMounted, i18n]);

  useLayoutEffect(() => {
    if (isPanelOpen && switcherRef.current) {
      const rect = switcherRef.current.getBoundingClientRect();
      const isDesktop = window.innerWidth >= 768;

      if (isDesktop) {
        setPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      } else {
        setPosition({
          bottom: window.innerHeight - rect.bottom - 7,
          right: window.innerWidth - rect.left + 120,
        });
      }
    }
  }, [isPanelOpen]);

  useEffect(() => {
    if (!isPanelOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setPanelOpen(false);
        event.stopPropagation();
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
      {loading &&
        hasMounted &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-[9999]">
            <div className="loader">
              <div style={{ "--i": 1 } as React.CSSProperties}></div>
              <div style={{ "--i": 2 } as React.CSSProperties}></div>
              <div style={{ "--i": 3 } as React.CSSProperties}></div>
              <div style={{ "--i": 4 } as React.CSSProperties}></div>
            </div>
          </div>,
          document.body
        )}

      <div ref={switcherRef} className="relative flex items-center">
        <button
          onClick={largeScreenToggle}
          onMouseLeave={handleMouseLeave}
          className={`group w-20 h-10 rounded-full relative overflow-hidden hidden lg:flex items-center justify-center bg-white/10 backdrop-blur-xs border border-white/30 shadow-md cursor-pointer`}
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
                className={`transition-all opacity-80 ${
                  !isHoverDisabled
                    ? isThai
                      ? "group-hover:translate-x-1 group-hover:opacity-90"
                      : "group-hover:-translate-x-1 group-hover:opacity-90"
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
                  className="w-full h-full object-cover"
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
                    ? `opacity-80 ${
                        !isHoverDisabled ? "group-hover:opacity-100" : ""
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

        <button
          onClick={() => {
            setOpenNavbar(false);
            setPanelOpen((prev) => !prev);

            if (typeof onCloseSearch === "function") {
              onCloseSearch();
            }
          }}
          className={`md:w-10 md:h-10 w-8 h-8 rounded-full flex lg:hidden items-center justify-center bg-white/10 backdrop-blur-xs border border-white/30 md:shadow-md cursor-pointer ${
            isPanelOpen && "md:bg-white/40 border-white/60"
          }`}
          disabled={loading}
        >
          <div className="md:w-6 md:h-6 w-full h-full">
            <img
              src={
                isThai
                  ? "/assets/icons/th-icon.svg"
                  : "/assets/icons/en-icon.svg"
              }
              alt="lang-icon"
              className={`w-full h-full object-cover opacity-60 transition-all ${
                isPanelOpen && "opacity-80"
              }`}
              draggable="false"
            />
          </div>
        </button>

        {hasMounted &&
          createPortal(
            <AnimatePresence>
              {isPanelOpen && position && (
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
                  className="fixed w-40 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg overflow-hidden z-[999]"
                  style={{
                    top: position.top ? `${position.top}px` : "auto",
                    right: position.right ? `${position.right}px` : "auto",
                    bottom: position.bottom ? `${position.bottom}px` : "auto",
                    left: position.left ? `${position.left}px` : "auto",
                  }}
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
            </AnimatePresence>,
            document.body
          )}
      </div>
    </>
  );
}
