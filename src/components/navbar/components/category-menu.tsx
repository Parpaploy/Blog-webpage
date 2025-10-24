"use client";

import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

function CategoryMenu({
  title,
  handleCategoryClick,
  catTitle,
  selectedCategories,
  loadingCategories,
  isDisable,
}: {
  title: string;
  handleCategoryClick: (catTitle: string) => void;
  catTitle: string;
  selectedCategories: string[];
  loadingCategories: string[];
  isDisable: boolean;
}) {
  const isSelected = selectedCategories.includes(catTitle);
  const isLoading = loadingCategories.includes(catTitle);
  const disabled = isDisable || isLoading;

  const getButtonClasses = () => {
    if (disabled) {
      return isSelected
        ? "bg-white/45 text-black/40 pointer-events-none"
        : "bg-white/10 text-white/40 pointer-events-none";
    }

    return isSelected
      ? "bg-white/90 text-black/80"
      : "text-white/80 bg-white/10 hover:bg-white/30 hover:text-white/90";
  };

  return (
    <motion.div
      variants={itemVariants}
      onClick={() => handleCategoryClick(catTitle)}
      className={`cursor-pointer text-center md:px-4 md:py-2 px-3 py-1 rounded-full transition-colors backdrop-blur-sm border shadow-md line-clamp-1 border-white/20
        ${
          isDisable || isLoading
            ? `pointer-events-none ${
                isSelected
                  ? "bg-white/45 text-black/40"
                  : "text-white/40 bg-white/5"
              }`
            : isSelected
            ? "bg-white/90 text-black/80"
            : "text-white/80 bg-white/10 hover:bg-white/30 hover:text-white/90"
        }`}
    >
      {isLoading ? (
        <div
          className={`w-5 h-5 border-2 rounded-full animate-spin ${
            isSelected && !disabled
              ? "border-black/30 border-t-black"
              : "border-white/30 border-t-white"
          }`}
        />
      ) : (
        title
      )}
    </motion.div>
  );
}

export default CategoryMenu;
