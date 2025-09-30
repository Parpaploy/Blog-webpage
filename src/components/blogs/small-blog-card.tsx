"use client";

import React from "react";
import { IBlog, ICategory } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import { useSidebar } from "../../../hooks/sidebar";
import CategoryTag from "./category-tag";

export default function SmallBlogCard({ blog }: { blog: IBlog }) {
  const { isSidebar } = useSidebar();

  return (
    <a
      href={`/blogs/${blog.documentId}`}
      className="rounded-2xl cursor-pointer"
    >
      <div
        className={`flex w-full rounded-2xl border-1 bg-white overflow-hidden ${
          isSidebar ? "h-35" : "h-40"
        } transition-all`}
      >
        <div className="w-[45%] rounded-r-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.medium?.url}`}
            alt=""
          />
        </div>
        <div
          className={`w-[55%] flex flex-col justify-between items-start ${
            isSidebar ? "px-3 py-2" : "px-5 py-3"
          } transition-all`}
        >
          <div className="w-full text-start">
            <h2 className="font-bold text-xl line-clamp-2">{blog.title}</h2>
            <p className="font-medium text-md text-black/65 line-clamp-1">
              {blog.description}
            </p>
          </div>

          <div className="flex justify-start items-center gap-1">
            {blog.categories.map((cat: ICategory, index: number) => {
              return (
                <CategoryTag key={index} title={cat.title} textSize="sm" />
              );
            })}
          </div>

          <p className="text-xs text-black/50">
            {FormatDate(blog.publishedAt)}
          </p>
        </div>
      </div>
    </a>
  );
}
