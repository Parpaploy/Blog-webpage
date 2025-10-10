"use client";

import React from "react";
import { IBlog, ICategory } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import { useSidebar } from "../../../hooks/sidebar";
import CategoryTag from "../category-tag";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SmallSubscribeBlogCard({
  subBlog,
}: {
  subBlog: IBlog;
}) {
  const { isSidebar } = useSidebar();

  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/blogs/${subBlog.documentId}`);
      }}
      className={`relative cursor-pointer flex lg:flex-row flex-col lg:min-w-full min-w-60 max-w-60 lg:max-w-full rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg overflow-hidden transition-all ${
        isSidebar
          ? "2xl:min-h-45 xl:min-h-35 lg:min-h-30 h-full 2xl:max-h-45 xl:max-h-35 lg:max-h-30"
          : "2xl:min-h-50 xl:min-h-40 lg:min-h-35 h-full 2xl:max-h-50 xl:max-h-40 lg:max-h-35"
      } transition-all`}
    >
      <div className="lg:w-[45%] lg:h-full w-full h-[50%] rounded-r-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.thumbnail.formats.medium?.url}`}
          alt={subBlog.title + "'s tumbnail picture"}
        />
      </div>
      <div
        className={`lg:w-[55%] lg:h-full w-full h-[50%] flex flex-col justify-between items-start ${
          isSidebar ? "xl:px-3 xl:py-2 px-2 py-1" : "xl:px-5 xl:py-3 px-3 py-2"
        } transition-all`}
      >
        <div className="w-full text-start">
          <h2 className="font-bold text-xl line-clamp-1">{subBlog.title}</h2>
          <p className="font-medium text-md text-[#bdbdbd]/70 line-clamp-1">
            {subBlog.description}
          </p>
        </div>

        <div className="w-full space-y-1">
          {subBlog.categories && subBlog.categories.length > 0 && (
            <div
              className={`${
                isSidebar
                  ? "2xl:h-23 xl:h-13 lg:h-10 md:h-11.5"
                  : "2xl:h-23 xl:h-15 lg:h-13 md:h-9.5"
              } flex flex-wrap justify-start items-end gap-1 overflow-y-auto`}
            >
              {subBlog.categories.map((cat: ICategory, index: number) => {
                return (
                  <CategoryTag key={index} title={cat.title} textSize="sm" />
                );
              })}
            </div>
          )}

          <p className="xl:text-xs lg:text-[10px] md:text-[14px] text-[#bdbdbd]/70">
            {FormatDate(subBlog.createdAt)}
          </p>
        </div>
      </div>

      <div className="absolute top-2 left-2 text-[#424EDD] rounded-full bg-amber-300 z-20 p-1">
        <FaStar className="w-5 h-5" />
      </div>
    </div>
  );
}
