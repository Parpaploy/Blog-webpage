"use client";

import React from "react";
import { IBlog, ICategory } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";

export default function BlogCard({ blog }: { blog: IBlog }) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/blogs/${blog.documentId}`);
      }}
      className="cursor-pointer xl:w-80 xl:h-90 w-60 h-70 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg overflow-hidden"
    >
      <div className="w-full h-[50%] rounded-b-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.medium?.url}`}
          alt={blog.title + "'s tumbnail picture"}
        />
      </div>
      <div className="w-full h-[50%] flex flex-col justify-between items-start text-start px-5 py-3">
        <div className="w-full h-full">
          <h2 className="font-bold xl:text-2xl text-xl line-clamp-1">
            {blog.title}
          </h2>
          <p className="font-medium xl:text-md text-sm text-[#bdbdbd]/70 line-clamp-1">
            {blog.description}
          </p>
        </div>

        <div className="w-full flex flex-col gap-1">
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap xl:h-20 lg:h-12 md:h-10 h-9 justify-start items-end gap-1 overflow-x-auto">
              {blog.categories.map((cat: ICategory, index: number) => {
                return (
                  <CategoryTag key={index} title={cat.title} textSize="base" />
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
