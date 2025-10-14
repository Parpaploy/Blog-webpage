"use client";

import React from "react";
import { IBlog, ICategory, IUser } from "../../../interfaces/strapi.interface";
import { FormatDate } from "../../../utils/format-date";
import CategoryTag from "../category-tag";
import { useRouter } from "next/navigation";

export default function BlogCard({
  blog,
  user,
  selectedCategories = [],
}: {
  blog: IBlog;
  user: IUser | null;
  selectedCategories?: string[];
}) {
  // console.log(user?.id, ":user?.id");
  // console.log(blog.author?.id, ":blog.author?.id");

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
      className="cursor-pointer 2xl:w-95 2xl:h-105 xl:w-85 xl:h-95 w-70 h-80 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg overflow-hidden"
    >
      <div className="w-full h-[50%] rounded-b-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            blog.thumbnail?.formats?.medium?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${blog.thumbnail.formats.medium.url}`
              : "https://mom-neuroscience.com/wp-content/uploads/2021/06/no-image.jpg"
          }
          alt={blog.title + "'s tumbnail picture"}
        />
      </div>
      <div className="w-full h-[50%] flex flex-col justify-between items-start text-start px-5 py-3">
        <div className="w-full h-fit">
          <h2 className="font-bold xl:text-2xl text-xl line-clamp-1">
            {blog.title}
          </h2>
          <p className="font-medium xl:text-md text-sm text-[#bdbdbd]/70 line-clamp-1">
            {blog.description}
          </p>

          <div
            className="w-fit max-w-full flex justify-start items-center gap-2"
            onClick={goToUserBlogs}
          >
            <div className="xl:w-6 xl:h-6 w-5 h-5 overflow-hidden rounded-full">
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

            <p>{blog.author?.username}</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap 2xl:h-21 xl:h-16 lg:h-10 md:h-9 h-9 justify-start items-end gap-1 overflow-x-auto">
              {blog.categories.map((cat: ICategory, index: number) => {
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
            {FormatDate(blog.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
