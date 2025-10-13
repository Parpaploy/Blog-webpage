"use client";

import React from "react";
import { useSidebar } from "../../../hooks/sidebar";
import { useTranslation } from "react-i18next";
import {
  IBlog,
  ICategory,
  ISubscribeBlog,
  IUser,
} from "../../../interfaces/strapi.interface";
import BlogCard from "@/components/blogs/blog-card";
import SubscribeBlogCard from "@/components/subscribe-blogs/subscribe-blog-card";
import CategoryMenu from "@/components/category-menu";

export default function SearchDefaultPage({
  blogs,
  subscribeBlogs,
  user,
}: {
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
  user: IUser | null;
}) {
  const { t } = useTranslation("search");

  const { isSidebar } = useSidebar();

  const allBlogs = [
    ...blogs.map((blog) => ({ ...blog, type: "blog" })),
    ...subscribeBlogs.map((subBlog) => ({ ...subBlog, type: "subscribe" })),
  ];

  return (
    <main
      className={`w-full h-full overflow-y-auto 2xl:pt-[7svh] xl:pt-[9svh] lg:pt-[8svh] md:pt-[6svh] text-white/80 ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all scrollbar-hide`}
    >
      {allBlogs && allBlogs.length > 0 ? (
        <section className="w-full lg:px-10 lg:pt-10 md:px-0 md:pt-10 pb-3">
          <div className="flex flex-wrap gap-5 items-center justify-center">
            {allBlogs.map((item: any) =>
              item.type === "blog" ? (
                <BlogCard key={item.id} blog={item} user={user} />
              ) : (
                <SubscribeBlogCard key={item.id} subBlog={item} user={user} />
              )
            )}
          </div>
        </section>
      ) : (
        <section className="text-center w-full min-h-screen flex items-center justify-center">
          No Blogs found
        </section>
      )}
    </main>
  );
}
