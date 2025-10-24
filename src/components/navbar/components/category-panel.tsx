"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ICategory } from "../../../../interfaces/strapi.interface";
import CategoryMenu from "./category-menu";
import { RiResetRightLine } from "react-icons/ri";
import { createPortal } from "react-dom";

type PanelPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

const panelSlideVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

const itemVariants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

interface CategoryPanelProps {
  isOpenCat: boolean;
  menuContainerVariants: Variants;
  categories: ICategory[];
  onCategoryClick: (cat: string) => void;
  selectedCategories: string[];
  loadingCategories: string[];
  isDisable: boolean;
  onCategoryReset: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export default function CategoryPanel({
  isOpenCat,
  menuContainerVariants,
  categories,
  onCategoryClick,
  selectedCategories,
  loadingCategories,
  isDisable,
  onCategoryReset,
  buttonRef,
}: CategoryPanelProps) {
  const [hasMounted, setHasMounted] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (isOpenCat) {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);

      if (desktop && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          left: rect.left,
        });
      } else if (!desktop) {
        setPosition({
          bottom: 76,
        });
      }
    }
  }, [isOpenCat, buttonRef]);

  if (!hasMounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpenCat && position && (
        <motion.div
          ref={panelRef}
          key="category-panel-background"
          variants={panelSlideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed flex z-50 ${
            isDesktop ? "" : "left-1/2 -translate-x-1/2"
          } p-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-4xl shadow-md`} // 👈 3. ย้าย styling มาไว้ที่นี่
          style={{
            top: position.top ? `${position.top}px` : "auto",
            right: position.right ? `${position.right}px` : "auto",
            bottom: position.bottom ? `${position.bottom}px` : "auto",
            left: position.left ? `${position.left}px` : undefined,
          }}
        >
          <motion.div
            key="category-panel-content"
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`flex flex-wrap gap-3 items-center ${
              isDesktop ? "justify-start" : "justify-center"
            }`}
          >
            {categories.map((cat: ICategory) => (
              <CategoryMenu
                key={cat.title}
                title={cat.title}
                handleCategoryClick={onCategoryClick}
                catTitle={cat.title}
                selectedCategories={selectedCategories}
                loadingCategories={loadingCategories}
                isDisable={isDisable}
              />
            ))}

            <button
              onClick={onCategoryReset}
              disabled={isDisable || selectedCategories.length <= 0}
              className={`
                  group flex w-10 h-9 text-white/80 items-center justify-center 
                  transition-all bg-white/10 hover:enabled:bg-white/30 
                  !backdrop-blur-sm border border-white/30 
                  shadow-md rounded-4xl px-2 py-1 
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-white/10 cursor-pointer
              `}
            >
              <RiResetRightLine
                size={20}
                className={`${
                  isDisable
                    ? "animate-spin-smooth"
                    : selectedCategories.length > 0 &&
                      "group-hover:rotate-360 transition-transform duration-500 group-disabled:rotate-0"
                }`}
              />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
