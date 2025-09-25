"use client";
import React from "react";
import { IBlogs } from "../../../interfaces/strapi.interface";

export default function BlogCard({ blog }: { blog: IBlogs }) {
  return (
    <div className="w-80 h-90 rounded-2xl border-1 bg-white overflow-hidden">
      <div className="w-full h-[50%]">
        <img
          className="w-full h-full object-cover"
          src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.thumbnail?.url}`}
          alt=""
        />
      </div>
      <div className="w-full h-[50%] text-center p-5">
        <h2 className="font-bold text-2xl">{blog.title}</h2>
        <p className="font-medium text-md text-black/60 line-clamp-2">
          {blog.description}
        </p>
      </div>
    </div>
  );
}
