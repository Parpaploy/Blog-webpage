"use client";

import React from "react";
import { TextSize } from "../../types/ui.type";
import { getTextSizeClass } from "../../utils/text-size";

export default function CategoryTag({
  title,
  textSize,
  selectedCategories = [],
}: {
  title: string;
  textSize: TextSize;
  selectedCategories?: string[];
}) {
  const isSelected = selectedCategories.includes(title);

  return (
    <div
      className={`xl:text-[14px] md:text-[10px] xl:px-1.5 px-1 xl:rounded-md rounded-sm bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg line-clamp-1 
                  ${getTextSizeClass(textSize)}
                  ${
                    isSelected
                      ? "bg-white/50 text-white/80"
                      : "text-white/80 bg-white/10"
                  }`}
    >
      {title}
    </div>
  );
}
