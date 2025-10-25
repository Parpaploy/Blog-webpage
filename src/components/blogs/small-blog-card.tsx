"use client";

import React from "react";
import { IBlog, ICategory, IUser } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import { useSidebar } from "../../../hooks/sidebar";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function SmallBlogCard({
  blog,
  user,
}: {
  blog: IBlog;
  user: IUser | null;
}) {
  const { isSidebar } = useSidebar();

  const { t } = useTranslation("blogs");

  const router = useRouter();

  const goToUserBlogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.id !== blog.author?.id) {
      router.push(`/user-blogs/${blog.author?.id}`);
    } else {
      router.push("/your-blogs");
    }
  };

  return (
    <div
      onClick={() => {
        router.push(`/blogs/${blog.documentId}`);
      }}
      className={`cursor-pointer flex lg:flex-row flex-col lg:min-w-full min-w-60 max-w-60 lg:max-w-full rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-md overflow-hidden transition-all ${
        isSidebar
          ? "2xl:min-h-45 xl:min-h-35 lg:min-h-30 h-full 2xl:max-h-45 xl:max-h-35 lg:max-h-30"
          : "2xl:min-h-50 xl:min-h-40 lg:min-h-35 h-full 2xl:max-h-50 xl:max-h-40 lg:max-h-35"
      } transition-all`}
    >
      <div className="lg:w-[45%] lg:h-full w-full h-[50%] rounded-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            blog.thumbnail?.formats?.medium?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.medium?.url}`
              : "https://mom-neuroscience.com/wp-content/uploads/2021/06/no-image.jpg"
          }
          alt={blog.title + "'s tumbnail picture"}
        />
      </div>

      <div
        className={`lg:w-[55%] lg:h-full w-full h-[50%] flex flex-col justify-between items-start ${
          isSidebar
            ? "xl:px-3 xl:py-2 px-2 py-1"
            : "xl:px-5 xl:py-3 md:px-3 md:py-2 px-2 py-1"
        } transition-all`}
      >
        <div className="w-full text-start">
          <h2 className="font-bold md:text-xl text-md line-clamp-1">
            {blog.title}
          </h2>
          <p className="font-medium md:text-md text-sm text-black/20 line-clamp-1">
            {blog.description}
          </p>

          {blog.author && (
            <div
              className="w-fit max-w-full flex justify-start items-center md:gap-2 gap-1.5"
              onClick={goToUserBlogs}
            >
              <div className="xl:w-6 xl:h-6 lg:w-4 lg:h-4 w-5 h-5 overflow-hidden rounded-full">
                <img
                  className="w-full h-full object-cover"
                  src={
                    blog.author?.profile?.formats?.small?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.author.profile.formats.small.url}`
                      : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                  }
                  alt={blog.author + "profile picture"}
                />
              </div>

              <p className="xl:text-sm lg:text-xs text-sm">
                {blog.author?.username}
              </p>
            </div>
          )}
        </div>

        <div className="w-full space-y-1">
          {blog.categories && blog.categories.length > 0 && (
            <div
              className={`${
                isSidebar
                  ? "2xl:h-15 xl:h-6 lg:h-4.5 md:h-7 h-5"
                  : "2xl:h-18 xl:h-8 lg:h-7 md:h-5 h-5"
              } flex flex-wrap justify-start items-end gap-1 overflow-y-auto scrollbar-hide`}
            >
              {blog.categories.map((cat: ICategory, index: number) => {
                return (
                  <CategoryTag key={index} title={cat.title} textSize="sm" />
                );
              })}
            </div>
          )}

          <p className="xl:text-xs lg:text-[10px] md:text-[14px] text-[12px] text-black/20 text-end">
            {FormatDate(blog.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
