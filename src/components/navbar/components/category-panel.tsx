"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ICategory } from "../../../../interfaces/strapi.interface";
import CategoryMenu from "./category-menu";
import { RiResetRightLine } from "react-icons/ri";
import { createPortal } from "react-dom";
import { PanelPosition } from "../../../../types/ui.type";

const panelSlideVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

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
}: {
  isOpenCat: boolean;
  menuContainerVariants: Variants;
  categories: ICategory[];
  onCategoryClick: (cat: string) => void;
  selectedCategories: string[];
  loadingCategories: string[];
  isDisable: boolean;
  onCategoryReset: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
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

  const isResetDisabled = isDisable || selectedCategories.length <= 0;

  const resetButtonVariants = {
    hidden: { opacity: 0, transition: { duration: 0.2 } },
    visible: {
      opacity: isResetDisabled ? 0.6 : 1,
      transition: { duration: 0.3 },
    },
  };

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
          className={`fixed md:w-auto md:max-w-[40%] w-[95%] z-50 ${
            isDesktop
              ? "flex-wrap justify-center items-center"
              : "flex left-1/2 -translate-x-1/2"
          } p-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-4xl shadow-md`}
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
            className="flex flex-wrap gap-3 items-center justify-center"
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

            <motion.button
              variants={resetButtonVariants}
              onClick={onCategoryReset}
              disabled={isResetDisabled}
              className={`
                  group flex w-10 h-9 text-white/80 items-center justify-center 
                  
                  /* 1. ลบ 'transition-all' ออก */
                  
                  /* 2. เพิ่ม 'transition-colors' เข้าไปแทน */
                  transition-colors duration-300 ease-in-out /* <-- เพิ่มบรรทัดนี้ */

                  bg-white/10 hover:enabled:bg-white/30 
                  !backdrop-blur-sm border border-white/30 
                  shadow-md rounded-4xl px-2 py-1 
                  disabled:cursor-not-allowed disabled:bg-white/10 cursor-pointer
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
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
