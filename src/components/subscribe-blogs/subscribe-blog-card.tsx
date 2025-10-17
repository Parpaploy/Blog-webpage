"use client";

import React from "react";
import {
  ICategory,
  ISubscribeBlog,
  IUser,
} from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";
import Star from "./star";
import HighlightText from "../highlight";

export default function SubscribeBlogCard({
  subBlog,
  user,
  selectedCategories = [],
  query,
}: {
  subBlog: ISubscribeBlog;
  user: IUser | null;
  selectedCategories?: string[];
  query?: string;
}) {
  const router = useRouter();

  const goToUserBlogs = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (user?.id !== subBlog.author?.id) {
      router.push(`/user-blogs/${subBlog.author?.id}`);
    } else {
      router.push("/your-blogs");
    }
  };

  return (
    <div
      onClick={() => {
        router.push(`/subscribe-blogs/${subBlog.documentId}`);
      }}
      className="cursor-pointer 2xl:w-95 2xl:h-105 xl:w-85 xl:h-95 w-70 h-80 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-md overflow-hidden relative"
    >
      <div className="w-full h-[50%] rounded-b-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            subBlog.thumbnail?.formats?.medium?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.thumbnail.formats.medium.url}`
              : "https://mom-neuroscience.com/wp-content/uploads/2021/06/no-image.jpg"
          }
          alt={subBlog.title + "'s tumbnail picture"}
        />
      </div>
      <div className="w-full h-[50%] flex flex-col justify-between items-start text-start px-5 py-3">
        <div className="w-full h-fit">
          <h2 className="font-bold xl:text-2xl text-xl line-clamp-1">
            <HighlightText text={subBlog.title} highlight={query} />
          </h2>
          <p className="font-medium xl:text-md text-sm text-[#bdbdbd]/70 line-clamp-1">
            <HighlightText text={subBlog.description} highlight={query} />
          </p>

          {subBlog.author && (
            <div
              className="w-fit max-w-full flex justify-start items-center gap-2 mt-1"
              onClick={goToUserBlogs}
            >
              <div className="xl:w-6 xl:h-6 w-5 h-5 overflow-hidden rounded-full">
                <img
                  className="w-full h-full object-cover"
                  src={
                    subBlog.author?.profile?.formats?.small?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${subBlog.author.profile.formats.small.url}`
                      : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                  }
                  alt={subBlog.author + "profile picture"}
                />
              </div>

              <p>
                <HighlightText
                  text={subBlog.author?.username}
                  highlight={query}
                />
              </p>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-1">
          {subBlog.categories && subBlog.categories.length > 0 && (
            <div className="flex flex-wrap 2xl:h-20 xl:h-15 lg:h-9 md:h-7 h-6.5 justify-start items-end gap-1 overflow-x-auto">
              {subBlog.categories.map((cat: ICategory, index: number) => {
                return (
                  <CategoryTag
                    key={index}
                    title={cat.title}
                    textSize="base"
                    selectedCategories={selectedCategories}
                  />
                );
              })}
            </div>
          )}

          <p className="xl:text-xs lg:text-[10px] md:text-[14px] text-[#bdbdbd]/70 text-end">
            {FormatDate(subBlog.createdAt)}
          </p>
        </div>
      </div>

      <Star />
    </div>
  );
}
