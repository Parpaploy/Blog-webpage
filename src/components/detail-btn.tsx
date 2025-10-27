"use client";

import React from "react";
import { FormatDate } from "../../utils/format-date";
import { FiMoreHorizontal } from "react-icons/fi";
import { IBlog } from "../../interfaces/strapi.interface";

export default function DetailButton({
  blog,
  isToggle,
  setOpenBlogId,
  isSmall = false,
}: {
  blog: IBlog;
  isToggle: boolean;
  setOpenBlogId: (id: string | null) => void;
  isSmall?: boolean;
}) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenBlogId(isToggle ? null : blog.documentId);
  };

  return (
    <div
      className={`${
        isSmall ? "gap-1" : "md:gap-3 gap-1"
      } absolute md:bottom-2 md:right-2 bottom-1.5 right-1.5 flex items-center justify-end`}
    >
      <p
        className={`${
          isSmall
            ? "xl:text-[11px] lg:text-[8px] text-[10px] mt-1"
            : "xl:text-xs lg:text-[10px] md:text-[14px] text-[10px]"
        } text-black/20`}
      >
        {FormatDate(blog.updatedAt)}
      </p>

      <button
        onClick={handleToggle}
        className={`${
          isToggle
            ? "bg-black/70 text-white/90 border-white/40"
            : "bg-black/50 hover:bg-black/70 text-white/80 hover:text-white/90 hover:border-white/40"
        } cursor-pointer rounded-full border border-white/30 backdrop-blur-sm backdrop-brightness-200 transition-all ${
          isSmall
            ? "xl:p-1 lg:p-0.5 md:p-1 p-0.5 xl:text-lg lg:text-sm md:text-md text-sm"
            : "md:p-1 p-0.5 md:text-lg text-sm"
        }`}
      >
        <FiMoreHorizontal />
      </button>
    </div>
  );
}
