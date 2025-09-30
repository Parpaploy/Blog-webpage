"use client";

import React from "react";
import {
  ICategory,
  ISubscribeBlog,
} from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import CategoryTag from "../blogs/category-tag";

export default function SubscribeBlogCard({
  subBlog,
}: {
  subBlog: ISubscribeBlog;
}) {
  return (
    <a
      href={`/subscribe-blogs/${subBlog.documentId}`}
      className="rounded-2xl cursor-pointer"
    >
      <div className="w-80 h-90 rounded-2xl border-1 bg-white overflow-hidden">
        <div className="w-full h-[50%] rounded-b-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.thumbnail.formats.medium?.url}`}
            alt=""
          />
        </div>
        <div className="w-full h-[50%] flex flex-col justify-between items-start text-start px-5 py-3">
          <div className="w-full h-full">
            <h2 className="font-bold text-2xl line-clamp-2">{subBlog.title}</h2>
            <p className="font-medium text-md text-black/65 line-clamp-2">
              {subBlog.description}
            </p>
          </div>

          {subBlog.categories && subBlog.categories.length > 0 && (
            <div className="flex justify-start items-center gap-1 overflow-x-auto">
              {subBlog.categories.map((cat: ICategory, index: number) => {
                return (
                  <CategoryTag key={index} title={cat.title} textSize="base" />
                );
              })}
            </div>
          )}

          <p className="text-black/50">{FormatDate(subBlog.publishedAt)}</p>
        </div>
      </div>
    </a>
  );
}
