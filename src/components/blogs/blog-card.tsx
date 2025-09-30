"use client";

import React from "react";
import { IBlog, ICategory } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import CategoryTag from "./category-tag";

export default function BlogCard({ blog }: { blog: IBlog }) {
  return (
    <a
      href={`/blogs/${blog.documentId}`}
      className="rounded-2xl cursor-pointer"
    >
      <div className="w-80 h-90 rounded-2xl border-1 bg-white overflow-hidden">
        <div className="w-full h-[50%] rounded-b-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.medium?.url}`}
            alt={blog.title + "'s tumbnail picture"}
          />
        </div>
        <div className="w-full h-[50%] flex flex-col justify-between items-start text-start px-5 py-3">
          <div className="w-full h-full">
            <h2 className="font-bold text-2xl line-clamp-2">{blog.title}</h2>
            <p className="font-medium text-md text-black/65 line-clamp-2">
              {blog.description}
            </p>
          </div>

          <div className="flex justify-start items-center gap-1">
            {blog.categories.map((cat: ICategory, index: number) => {
              return <CategoryTag title={cat.title} />;
            })}
          </div>

          <p className="text-black/50">{FormatDate(blog.publishedAt)}</p>
        </div>
      </div>
    </a>
  );
}
