"use client";

import React from "react";
import { ISubscribeBlog } from "../../../../interfaces/strapi.interface";
import { FormatDate } from "../../../../utils/format-date";
import { FormatRichText } from "../../../../utils/format-rich-text";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../../hooks/sidebar";
import SmallSubscribeBlogCard from "@/components/subscribe-blogs/small-subscribe-blog-card";

export default function SubscribeBlogDetailPage({
  subBlog,
  subBlogs,
  subBlogUser,
}: {
  subBlog: ISubscribeBlog;
  subBlogs: ISubscribeBlog[];
  subBlogUser: ISubscribeBlog;
}) {
  const { t } = useTranslation("blogs");

  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-full flex ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      {/* Detail */}
      <section className="w-[70%] h-full overflow-y-auto pr-8">
        <div className="w-full text-start mb-5">
          <h1 className="text-4xl font-bold">{subBlog?.title}</h1>
          <p className="text-[#6e6e6e]">{subBlog?.description}</p>
        </div>
        <div className="w-full h-130 rounded-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.thumbnail.formats.large?.url}`}
          />
        </div>
        <div className="w-full flex justify-between items-start my-3">
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                className="w-full h-full"
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlogUser.author?.profile.formats.small?.url}`}
              />
            </div>

            <p className="text-xl font-semibold">{subBlog.author?.username}</p>
          </div>

          <div className="w-full text-end">
            <p className="text-sm text-black/50">
              {FormatDate(subBlog?.publishedAt)}
            </p>
          </div>
        </div>

        {FormatRichText(subBlog?.detail)}
      </section>

      <div className="w-[1px] bg-black/30" />

      {/* Other blogs */}
      <section className="w-[30%] h-full flex flex-col pl-8">
        <h1 className="text-3xl font-bold text-start mb-3">Other blogs</h1>
        <div className="w-full h-full flex flex-col items-start justify-start gap-5 overflow-y-auto">
          {subBlogs.map((subBlog, index: number) => {
            return (
              <SmallSubscribeBlogCard key={subBlog.id} subBlog={subBlog} />
            );
          })}
        </div>
      </section>
    </main>
  );
}
