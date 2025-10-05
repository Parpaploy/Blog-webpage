"use client";

import React from "react";
import { IBlog, ICategory } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import { useSidebar } from "../../../hooks/sidebar";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";

export default function SmallBlogCard({ blog }: { blog: IBlog }) {
  const { isSidebar } = useSidebar();

  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/blogs/${blog.documentId}`);
      }}
      className={`cursor-pointer flex lg:flex-row flex-col lg:w-full w-60 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg overflow-hidden transition-all ${
        isSidebar
          ? "2xl:h-45 xl:h-35 lg:h-30 h-full"
          : "2xl:h-50 xl:h-40 lg:h-35 h-full"
      } transition-all`}
    >
      <div className="lg:w-[45%] lg:h-full w-full h-[50%] rounded-r-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.medium?.url}`}
          alt={blog.title + "'s tumbnail picture"}
        />
      </div>
      <div
        className={`lg:w-[55%] lg:h-full w-full h-[50%] flex flex-col justify-between items-start ${
          isSidebar ? "xl:px-3 xl:py-2 px-2 py-1" : "xl:px-5 xl:py-3 px-3 py-2"
        } transition-all`}
      >
        <div className="w-full text-start">
          <h2 className="font-bold text-xl line-clamp-1">{blog.title}</h2>
          <p className="font-medium text-md text-[#bdbdbd]/70 line-clamp-1">
            {blog.description}
          </p>
        </div>

        <div className="w-full space-y-1">
          {blog.categories && blog.categories.length > 0 && (
            <div
              className={`${
                isSidebar
                  ? "2xl:h-23 xl:h-11 lg:h-10 md:h-11.5"
                  : "2xl:h-23 xl:h-10 lg:h-13 md:h-9.5"
              } flex flex-wrap justify-start items-end gap-1 overflow-y-auto`}
            >
              {blog.categories.map((cat: ICategory, index: number) => {
                return (
                  <CategoryTag key={index} title={cat.title} textSize="sm" />
                );
              })}
            </div>
          )}

          <p className="xl:text-xs lg:text-[10px] md:text-[14px] text-[#bdbdbd]/70">
            {FormatDate(blog.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
