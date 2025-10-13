"use client";

import React from "react";
import { TextSize } from "../../types/ui.type";
import { getTextSizeClass } from "../../utils/text-size";

export default function CategoryTag({
  title,
  textSize,
}: {
  title: string;
  textSize: TextSize;
}) {
  return (
    <div
      className={`xl:text-[14px] md:text-[10px] text-white xl:px-1.5 px-1 xl:rounded-md rounded-sm bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg line-clamp-1 ${getTextSizeClass(
        textSize
      )}`}
    >
      {title}
    </div>
  );
}
