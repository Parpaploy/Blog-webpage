"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../../hooks/sidebar";
import BlogCard from "@/components/blogs/blog-card";
import {
  IBlog,
  ISubscribeBlog,
  IUser,
} from "../../interfaces/strapi.interface";
import SubscribeBlogCard from "@/components/subscribe-blogs/subscribe-blog-card";
import ContinueButton from "@/components/continue-btn";

export default function HomepageDefault({
  user,
  blogs,
  subscribeBlogs,
}: {
  user: IUser | null;
  blogs: IBlog[];
  subscribeBlogs: ISubscribeBlog[];
}) {
  // console.log(blogs, ":blogs");
  // console.log(subscribeBlogs, ":subscribe blogs");

  const { t } = useTranslation("home");

  const { isSidebar } = useSidebar();

  return (
    <main
      className={`w-full h-full overflow-y-auto ${
        isSidebar ? "pl-65" : "pl-25"
      } transition-all`}
    >
      <div className="mb-5">
        <a href="/blogs" className="inline-block">
          <div className="text-2xl font-bold">{t("blog_title")}</div>
        </a>

        {blogs && blogs.length > 0 ? (
          <section className="w-full h-auto overflow-y-auto py-3">
            <div className="flex gap-5 items-center justify-start">
              {blogs.map((blog, index: number) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}

              <ContinueButton path="/blogs" />
            </div>
          </section>
        ) : (
          <section className="text-center w-full h-80 flex items-center justify-center">
            No Blogs found
          </section>
        )}
      </div>

      {user !== null && (
        <div>
          <a href="/subscribe-blogs" className="inline-block">
            <h1 className="text-2xl font-bold w-fit">
              {t("subscribe_blog_title")}
            </h1>
          </a>

          {subscribeBlogs && subscribeBlogs.length > 0 ? (
            <section className="w-full h-auto overflow-y-auto py-3">
              <div className="flex gap-5 items-center justify-start">
                {subscribeBlogs.map((subBlog, index: number) => (
                  <SubscribeBlogCard key={subBlog.id} subBlog={subBlog} />
                ))}

                <ContinueButton path="/subscribe-blogs" />
              </div>
            </section>
          ) : (
            <section className="text-center w-full h-80 flex items-center justify-center">
              No Subscribe blogs found
            </section>
          )}
        </div>
      )}
    </main>
  );
}
