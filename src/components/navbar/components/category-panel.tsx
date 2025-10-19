"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ICategory } from "../../../../interfaces/strapi.interface";
import CategoryMenu from "./category-menu";
import { RiResetRightLine } from "react-icons/ri";

interface CategoryPanelProps {
  isOpenCat: boolean;
  menuContainerVariants: Variants;
  categories: ICategory[];
  onCategoryClick: (cat: string) => void;
  selectedCategories: string[];
  loadingCategories: string[];
  isDisable: boolean;
  onCategoryReset: () => void;
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
}: CategoryPanelProps) {
  return (
    <div
      className={`w-full flex flex-wrap gap-3 items-center justify-center absolute top-14 left-1/2 -translate-x-1/2 transition-all duration-300 `}
    >
      <AnimatePresence>
        {isOpenCat && (
          <motion.div
            key="category-menu-container"
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="py-3 w-full flex flex-wrap gap-3 items-center justify-center bg-white/10 backdrop-blur-md border border-white/30 rounded-4xl shadow-md"
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

            {selectedCategories.length > 0 && (
              <button
                onClick={onCategoryReset}
                disabled={isDisable}
                className={`
                  group flex w-10 h-9 items-center justify-center 
                  transition-all bg-white/10 hover:enabled:bg-white/30 
                  backdrop-blur-sm border border-white/30 
                  shadow-md rounded-4xl px-2 py-1 
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-white/10 cursor-pointer
                `}
              >
                <RiResetRightLine
                  size={20}
                  className={`${
                    isDisable
                      ? "animate-spin-smooth"
                      : "group-hover:rotate-360 transition-transform duration-500 group-disabled:rotate-0"
                  }`}
                />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
