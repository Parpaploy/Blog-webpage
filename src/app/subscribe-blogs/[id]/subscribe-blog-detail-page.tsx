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
  const { t } = useTranslation("subscribe-blogs");

  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-full flex lg:flex-row flex-col text-white ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      {/* Detail */}
      <section className="lg:w-[70%] w-full lg:h-full h-[70%] overflow-y-auto pr-8 lg:mb-0 mb-3 scrollbar-hide">
        <div className="before:block 2xl:before:h-[7svh] xl:before:h-[9svh] lg:before:h-[8svh] md:before:h-[5svh] before:content-['']" />

        <div className="w-full text-start mb-5">
          <h1 className="text-4xl font-bold">{subBlog?.title}</h1>
          <p className="text-[#cfcfcf]">{subBlog?.description}</p>
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
            <p className="text-sm text-white/50">
              {FormatDate(subBlog?.publishedAt)}
            </p>
          </div>
        </div>

        {FormatRichText(subBlog?.detail)}
      </section>

      <div className="w-[1px] bg-white/30 h-[95%] my-auto" />

      {/* Other blogs */}
      <section className="lg:w-[30%] w-full lg:h-full h-[30%] flex flex-col lg:pl-8 pl-0 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] pt-0">
        <h1 className="text-3xl font-bold text-start mb-3">
          Other subscribe blogs
        </h1>

        <div className="w-full h-full flex lg:flex-col flex-row items-start justify-start gap-5 lg:overflow-x-hidden lg:overflow-y-auto overflow-y-hidden overflow-x-auto scrollbar-hide pb-3">
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
