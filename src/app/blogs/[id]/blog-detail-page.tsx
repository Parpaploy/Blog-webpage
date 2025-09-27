"use client";

import React from "react";
import { IBlog } from "../../../../interfaces/strapi.interface";
import SmallBlogCard from "@/components/blogs/small-blog-card";
import { FormatDate } from "../../../../utils/format-date";
import { FormatRichText } from "../../../../utils/format-rich-text";
import { useTranslation } from "react-i18next";

export default function BlogDetailPage({
  blog,
  blogs,
  blogUser,
}: {
  blog: IBlog;
  blogs: IBlog[];
  blogUser: IBlog;
}) {
  const { t } = useTranslation("blogs");

  return (
    <main className="w-full h-[91svh] max-w-[1920px] mx-auto flex py-5">
      <section className="w-[70%] h-full overflow-y-auto px-10">
        <div className="w-full text-start mb-5">
          <h1 className="text-4xl font-bold">{blog.title}</h1>
          <p className="text-[#6e6e6e]">{blog.description}</p>
        </div>
        <div className="w-full h-130 rounded-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.large?.url}`}
          />
        </div>
        <div className="w-full flex justify-between items-start my-3">
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                className="w-full h-full"
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blogUser.author.profile.formats.small?.url}`}
              />
            </div>

            <p className="text-xl font-semibold">{blog.author.username}</p>
          </div>

          <div className="w-full text-end">
            <p className="text-sm text-black/50">
              {FormatDate(blog.publishedAt)}
            </p>
          </div>
        </div>

        {FormatRichText(blog.detail)}
      </section>

      <section className="w-[30%] h-full flex flex-col border-l-1 border-black/30 pl-10">
        <h1 className="text-3xl font-bold text-start mb-6">Other blogs</h1>
        <div className="w-full h-full flex flex-col items-start justify-start gap-5 overflow-y-auto">
          {blogs.map((blog, index: number) => {
            return <SmallBlogCard key={blog.id} blog={blog} />;
          })}
        </div>
      </section>
    </main>
  );
}
