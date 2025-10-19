"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsSortUp, BsSortDown } from "react-icons/bs";
import { RiResetRightLine } from "react-icons/ri";

interface SortOption {
  key: string;
  asc: string;
  desc: string;
}

interface FilterPanelProps {
  isOpenFilter: boolean;
  isDisable: boolean;
  currentType: string;
  sortOptions: SortOption[];
  currentSort: string;
  currentDir: string;
  areFiltersActive: boolean;
  t: (key: string) => string;
  onTypeChange: (type: string) => void;
  onSortChange: (sortKey: string) => void;
  onFilterReset: () => void;
}

export default function FilterPanel({
  isOpenFilter,
  isDisable,
  currentType,
  sortOptions,
  currentSort,
  currentDir,
  areFiltersActive,
  t,
  onTypeChange,
  onSortChange,
  onFilterReset,
}: FilterPanelProps) {
  return (
    <AnimatePresence>
      {isOpenFilter && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-12 right-0 w-60 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-md rounded-lg overflow-hidden z-50"
        >
          <div className="p-3 border-b border-white/30">
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="blogType"
                  value="all"
                  checked={currentType === "all"}
                  onChange={() => onTypeChange("all")}
                  disabled={isDisable}
                  className="cursor-pointer checked:cursor-default appearance-none h-3 w-3 mb-1 border border-white/40 rounded-full bg-white/20 checked:bg-white/90 focus:outline-none focus:ring-0 transition-all duration-200"
                />
                <span className="text-sm text-white/90">{t("filter.all")}</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="blogType"
                  value="blog"
                  checked={currentType === "blog"}
                  onChange={() => onTypeChange("blog")}
                  disabled={isDisable}
                  className="cursor-pointer checked:cursor-default appearance-none h-3 w-3 mb-1 border border-white/40 rounded-full bg-white/20 checked:bg-white/80 focus:outline-none focus:ring-0 transition-all duration-200"
                />
                <span className="text-sm text-white/90">
                  {t("filter.free")}
                </span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="blogType"
                  value="subscribe"
                  checked={currentType === "subscribe"}
                  onChange={() => onTypeChange("subscribe")}
                  disabled={isDisable}
                  className="cursor-pointer checked:cursor-default appearance-none h-3 w-3 mb-1 border border-white/40 rounded-full bg-white/20 checked:bg-white/90 focus:outline-none focus:ring-0 transition-all duration-200"
                />
                <span className="text-sm text-white/90">
                  {t("filter.subscribe")}
                </span>
              </label>
            </div>
          </div>

          {sortOptions.map((option, index) => {
            const isActive = currentSort === option.key;
            const isDisabled = option.key === "price" && currentType === "blog";
            const label = isActive
              ? currentDir === "asc"
                ? option.asc
                : option.desc
              : option.key === "alphabetical"
              ? option.asc
              : option.desc;

            return (
              <div
                key={option.key}
                onClick={() => !isDisabled && onSortChange(option.key)}
                className={`text-md transition-all px-3 py-2.5 flex items-center justify-between ${
                  isDisabled
                    ? "text-white/40 bg-white/10 cursor-not-allowed"
                    : isActive
                    ? "text-white bg-white/40 font-semibold cursor-pointer"
                    : "text-white/80 hover:bg-white/30 hover:text-white/90 cursor-pointer"
                } ${
                  index < sortOptions.length - 1
                    ? "border-b border-white/30"
                    : ""
                }`}
              >
                <span>{label}</span>

                {isActive && !isDisabled && (
                  <span className="ml-2">
                    {currentDir === "asc" ? (
                      <BsSortUp size={18} />
                    ) : (
                      <BsSortDown size={18} />
                    )}
                  </span>
                )}
              </div>
            );
          })}

          <button
            onClick={onFilterReset}
            disabled={!areFiltersActive || isDisable}
            className={`group text-md transition-all px-3 py-2.5 flex items-center justify-center gap-2 w-full
              text-white/80 hover:bg-white/30 hover:text-white/90 cursor-pointer
              disabled:text-white/40 disabled:bg-white/10 disabled:cursor-not-allowed
            `}
          >
            <RiResetRightLine
              size={16}
              className={`${
                isDisable
                  ? "animate-spin-smooth cursor-pointer"
                  : "group-hover:rotate-360 transition-transform duration-500 group-disabled:rotate-0"
              }`}
            />
            <span>{t("filter.reset")}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
