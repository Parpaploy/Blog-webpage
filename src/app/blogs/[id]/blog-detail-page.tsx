"use client";

import React from "react";
import { IBlog, IUser } from "../../../../interfaces/strapi.interface";
import SmallBlogCard from "@/components/blogs/small-blog-card";
import { FormatDate } from "../../../../utils/format-date";
import { FormatRichText } from "../../../../utils/format-rich-text";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../../../hooks/sidebar";
import GlobalLoading from "@/app/loading";

export default function BlogDetailPage({
  blog,
  blogs,
  blogUser,
  user,
}: {
  blog: IBlog;
  blogs: IBlog[];
  blogUser: IBlog;
  user: IUser | null;
}) {
  const { t } = useTranslation("blogs");

  const { isSidebar } = useSidebar();

  // console.log(blog);

  const authorBlogs = blog?.author?.id
    ? blogs.filter(
        (b) =>
          b.author?.id &&
          b.author.id === blog.author.id &&
          b.documentId !== blog.documentId
      )
    : [];

  if (!blog) {
    return (
      <div className="w-screen h-full flex items-center justify-center text-white">
        <GlobalLoading />
      </div>
    );
  }

  return (
    <main
      className={`w-full h-full flex lg:flex-row flex-col text-white ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      {/* Detail */}
      <section className="lg:w-[70%] w-full lg:h-full h-[70%] overflow-y-auto pr-8 lg:mb-0 mb-3 scrollbar-hide">
        <div className="before:block 2xl:before:h-[7svh] xl:before:h-[9svh] lg:before:h-[8svh] md:before:h-[6svh] before:content-['']" />
        <div className="w-full text-start mb-5">
          <h1 className="text-4xl font-bold">{blog?.title}</h1>
          <p className="text-[#cfcfcf]">{blog?.description}</p>
        </div>
        <div className="w-full h-130 rounded-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={
              blog.thumbnail?.formats?.large?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.large?.url}`
                : "https://mom-neuroscience.com/wp-content/uploads/2021/06/no-image.jpg"
            }
          />
        </div>
        <div className="w-full flex justify-between items-start my-3">
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={
                  blogUser.author?.profile?.formats?.small?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blogUser.author.profile.formats.small.url}`
                    : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                }
              />
            </div>

            <p className="text-xl font-semibold">{blog.author?.username}</p>
          </div>

          <div className="w-full text-end">
            <p className="text-sm text-white/50">
              {FormatDate(blog?.publishedAt)}
            </p>
          </div>
        </div>
        {FormatRichText(blog?.detail)}
      </section>

      <div className="lg:w-[1px] w-[95%] bg-white/30 lg:h-[95%] h-[1px] lg:mb-0 mb-3 mx-auto lg:self-center" />

      {/* Other blogs */}
      <section className="lg:w-[30%] w-full lg:h-full h-[30%] flex flex-col lg:pl-8 pl-0 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] pt-0">
        <h1 className="text-3xl font-bold text-start mb-3">
          {t("more", { username: blog.author?.username })}
        </h1>

        <div className="w-full h-full flex lg:flex-col flex-row items-start justify-start gap-5 lg:overflow-x-hidden lg:overflow-y-auto overflow-y-hidden overflow-x-auto scrollbar-hide pb-3">
          {authorBlogs.length > 0 ? (
            <div className="w-full h-full flex lg:flex-col flex-row items-start justify-start gap-5 lg:overflow-x-hidden lg:overflow-y-auto overflow-y-hidden overflow-x-auto scrollbar-hide pb-3">
              {authorBlogs.map((authorBlog) => {
                return (
                  <SmallBlogCard
                    key={authorBlog.id}
                    blog={authorBlog}
                    user={user}
                  />
                );
              })}
            </div>
          ) : (
            <div className="w-full min-h-full flex justify-center items-center text-white/50 text-sm text-center">
              {t("no_more")}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
